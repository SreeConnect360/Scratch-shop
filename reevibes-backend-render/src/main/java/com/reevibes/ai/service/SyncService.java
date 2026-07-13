package com.reevibes.ai.service;

import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class SyncService {
    private final AtomicLong globalVersion = new AtomicLong(System.currentTimeMillis());

    public long getVersion() {
        return globalVersion.get();
    }

    public void bumpVersion() {
        globalVersion.set(System.currentTimeMillis());
    }
}
