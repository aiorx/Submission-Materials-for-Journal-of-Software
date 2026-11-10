package server;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// The code below was Assisted with basic coding tools
public class EventBus {
    private final Map<String, List<EventListener>> listeners = new HashMap<>();

    public void register(String eventType, EventListener listener) {
        listeners.computeIfAbsent(eventType, k -> new ArrayList<>()).add(listener);
    }

    public void publish(String eventType, Object data) {
        List<EventListener> eventListeners = listeners.get(eventType);
        if (eventListeners != null) {
            for (EventListener listener : eventListeners) {
                listener.handle(data);
            }
        }
    }

    public interface EventListener {
        void handle(Object data);
    }
}

