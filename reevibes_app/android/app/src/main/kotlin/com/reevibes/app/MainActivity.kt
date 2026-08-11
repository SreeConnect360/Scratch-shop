package com.reevibes.app

import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import io.flutter.embedding.android.FlutterActivity

class MainActivity : FlutterActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableHighRefreshRate()
    }

    private fun enableHighRefreshRate() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                val display = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    display
                } else {
                    @Suppress("DEPRECATION")
                    windowManager.defaultDisplay
                }
                val modes = display?.supportedModes
                if (!modes.isNullOrEmpty()) {
                    var maxMode = modes[0]
                    for (mode in modes) {
                        if (mode.refreshRate > maxMode.refreshRate) {
                            maxMode = mode
                        }
                    }
                    val layoutParams = window.attributes
                    layoutParams.preferredDisplayModeId = maxMode.modeId
                    window.attributes = layoutParams
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
