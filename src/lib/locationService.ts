import { toast } from "sonner";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AddressDetails {
  country: string;
  state: string;
  district: string;
  city: string;
  locality: string;
  pincode: string;
}

/**
 * Normalizes strings by trimming and capitalizing words cleanly.
 */
export function normalizeField(str: string): string {
  if (!str) return "";
  const cleaned = str.trim().replace(/\s+/g, " ");
  // If string is ALL CAPS, convert to Title Case
  if (cleaned === cleaned.toUpperCase() && cleaned.length > 3) {
    return cleaned
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return cleaned;
}

/**
 * Standardize district names for special regions (e.g. AP district reorganization)
 */
export function normalizeDistrict(district: string, pincode: string = "", officeName: string = ""): string {
  let dist = normalizeField(district);
  const pin = pincode.trim();
  const nameLower = (officeName || "").toLowerCase();

  if (pin === "533001" || nameLower.includes("kakinada") || dist.toLowerCase().includes("kakinada")) {
    return "Kakinada";
  }
  if (dist === "East Godavari") {
    if (pin.startsWith("5330") || pin.startsWith("5334")) {
      return "Kakinada";
    } else if (pin.startsWith("5332")) {
      return "Konaseema";
    }
  }
  return dist;
}

/**
 * Reliable location detection using HTML5 Geolocation API with fallback strategy.
 * Tries high accuracy first, and falls back to network/IP positioning if high accuracy times out or fails.
 */
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser. Please enter your address manually."));
      return;
    }

    const highAccuracyOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const lowAccuracyOptions: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 30000,
    };

    // Attempt 1: High Accuracy GPS
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        // If permission was denied by user, fail fast with helpful message
        if (err.code === err.PERMISSION_DENIED) {
          reject(new Error("Location permission denied. Please allow location access in browser settings or enter your address manually."));
          return;
        }

        // Attempt 2: Fallback to Network/IP positioning (low accuracy)
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
          (secondErr) => {
            if (secondErr.code === secondErr.PERMISSION_DENIED) {
              reject(new Error("Location permission denied. Please allow location access in browser settings or enter your address manually."));
            } else if (secondErr.code === secondErr.POSITION_UNAVAILABLE) {
              reject(new Error("Location signal is unavailable. Please enter your address manually."));
            } else if (secondErr.code === secondErr.TIMEOUT) {
              reject(new Error("Location request timed out. Please enter your address manually."));
            } else {
              reject(new Error("Failed to detect location. Please enter your address manually."));
            }
          },
          lowAccuracyOptions
        );
      },
      highAccuracyOptions
    );
  });
}

/**
 * Lookup PIN code information using primary Indian Postal API with fallback.
 * NOTE: Returns ONLY region details (State, District, City, Locality). DOES NOT autofill street address.
 */
export async function fetchPincodeDetails(pincode: string): Promise<AddressDetails | null> {
  const cleanPin = pincode.trim().replace(/\D/g, "");
  if (cleanPin.length !== 6) return null;

  try {
    // Primary API: India Post Postal PIN Code API
    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
    const data = await res.json();

    if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
      const offices = data[0].PostOffice;
      const office = offices[0];

      const state = normalizeField(office.State || "");
      const district = normalizeDistrict(office.District || "", cleanPin, office.Name || "");
      
      // City/Town selection priority
      let city = normalizeField(office.Block && office.Block !== "NA" ? office.Block : (office.Division && office.Division !== "NA" ? office.Division : district));
      if (!city || city === "NA") city = district;

      const locality = normalizeField(office.Name || "");

      return {
        country: "India",
        state,
        district,
        city,
        locality,
        pincode: cleanPin,
      };
    }
  } catch (err) {
    console.warn("Primary PIN code lookup failed, attempting fallback API...", err);
  }

  // Fallback 1: Zippopotam API for India
  try {
    const res = await fetch(`https://api.zippopotam.us/in/${cleanPin}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.places && data.places.length > 0) {
        const place = data.places[0];
        const state = normalizeField(place.state || "");
        const city = normalizeField(place["place name"] || "");

        return {
          country: "India",
          state,
          district: city,
          city,
          locality: city,
          pincode: cleanPin,
        };
      }
    }
  } catch (err) {
    console.warn("Fallback PIN code API failed...", err);
  }

  // Fallback 2: Nominatim search by postal code
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${cleanPin}&country=India&format=json&addressdetails=1&limit=1`,
      { headers: { "User-Agent": "ReeVibes-Shop-Portal" } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data[0] && data[0].address) {
        const addr = data[0].address;
        const state = normalizeField(addr.state || addr.state_district || "");
        const district = normalizeDistrict(addr.state_district || addr.county || addr.district || "", cleanPin);
        const city = normalizeField(addr.city || addr.town || addr.village || addr.municipality || district);
        const locality = normalizeField(addr.suburb || addr.neighbourhood || addr.quarter || "");

        return {
          country: "India",
          state,
          district,
          city,
          locality,
          pincode: cleanPin,
        };
      }
    }
  } catch (err) {
    console.warn("Nominatim PIN code search failed...", err);
  }

  return null;
}

/**
 * Reverse geocode latitude and longitude to address details.
 * NOTE: DOES NOT populate street address so user can manually specify house/apartment details.
 */
export async function reverseGeocodeCoordinates(lat: number, lng: number): Promise<AddressDetails> {
  let pincode = "";
  let state = "";
  let district = "";
  let city = "";
  let locality = "";
  let country = "India";

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { "User-Agent": "ReeVibes-Shop-Portal" } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        pincode = (addr.postcode || "").replace(/\D/g, "").slice(0, 6);
        state = normalizeField(addr.state || addr.state_district || "");
        district = normalizeDistrict(addr.state_district || addr.county || addr.district || "", pincode);
        city = normalizeField(addr.city || addr.town || addr.village || addr.municipality || addr.city_district || district);
        locality = normalizeField(addr.suburb || addr.neighbourhood || addr.quarter || addr.residential || addr.road || "");
        country = normalizeField(addr.country || "India");
      }
    }
  } catch (err) {
    console.warn("Nominatim reverse geocode failed, trying fallback...", err);
  }

  // Fallback reverse geocoding via BigDataCloud API if state or city missing
  if (!state || !city) {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      if (res.ok) {
        const bdc = await res.json();
        if (bdc) {
          if (!pincode && bdc.postcode) pincode = bdc.postcode.replace(/\D/g, "").slice(0, 6);
          if (!state && bdc.principalSubdivision) state = normalizeField(bdc.principalSubdivision);
          if (!city && bdc.city) city = normalizeField(bdc.city);
          if (!locality && bdc.locality) locality = normalizeField(bdc.locality);
          if (bdc.countryName) country = normalizeField(bdc.countryName);
        }
      }
    } catch (e) {
      console.warn("BigDataCloud reverse geocode failed...", e);
    }
  }

  // If we have a 6-digit PIN code from location, enrich with official India Post data
  if (pincode && pincode.length === 6) {
    const pinData = await fetchPincodeDetails(pincode);
    if (pinData) {
      return {
        country: pinData.country || country,
        state: pinData.state || state,
        district: pinData.district || district,
        city: pinData.city || city,
        locality: locality || pinData.locality,
        pincode,
      };
    }
  }

  return {
    country,
    state,
    district,
    city,
    locality,
    pincode,
  };
}
