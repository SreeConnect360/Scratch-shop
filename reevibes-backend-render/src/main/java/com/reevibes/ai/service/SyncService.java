package com.reevibes.ai.service;

import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class SyncService {
    private final AtomicLong version = new AtomicLong(System.currentTimeMillis());

    public long getVersion() {
        return version.get();
    }

    public void bumpVersion() {
        version.set(System.currentTimeMillis());
    }
}
