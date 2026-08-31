package com.example.pigeon_party_app;

import static org.junit.Assert.*;

import android.graphics.Bitmap;

import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Map;


/**
 * This tests to see if our user class works
 */
public class UserTest {
    private User user;
    private Facility facility;
    private Bitmap sampleBitmap;

    @Before
    public void setUp() {
        facility = new Facility("test-user-id", "123 Facility St.", "Test Facility");
        user = new User("Test User", "test@user.com", "1234567890", "test-user-id", false, true, facility, true, "#000000", new ArrayList<>(), new ArrayList<>(), false);
        sampleBitmap = createSampleBitmap();
    }

    @Test
    public void testConstructor() {
        assertNotNull(user);
        assertEquals("Test User", user.getName());
        assertEquals("test@user.com", user.getEmail());
        assertEquals("1234567890", user.getPhoneNumber());
        assertEquals("test-user-id", user.getUniqueId());
        assertTrue(user.isEntrant());
        assertFalse(user.isOrganizer());
        assertNotNull(user.getFacility());
        assertTrue(user.hasNotificationsOn());
        assertEquals("#000000", user.getColour());
    }

    @Test
    public void testSettersAndGetters() {
        user.setName("New User");
        user.setEmail("new@user.com");
        user.setPhoneNumber("0987654321");
        user.setUniqueId("new-user-id");
        user.setEntrant(false);
        user.setOrganizer(true);
        user.setNotificationsOn(false);
        user.setColour("#FF0000");
        user.setProfileImagePath(sampleBitmap);

        assertEquals("New User", user.getName());
        assertEquals("new@user.com", user.getEmail());
        assertEquals("0987654321", user.getPhoneNumber());
        assertEquals("new-user-id", user.getUniqueId());
        assertFalse(user.isEntrant());
        assertTrue(user.isOrganizer());
        assertFalse(user.hasNotificationsOn());
        assertEquals("#FF0000", user.getColour());
        assertEquals(sampleBitmap, user.getProfileImagePath());
    }

    /**
     * This tests our add and remove functions
     */
    @Test
    public void testAddAndRemoveEntrantEvent() {
        user.addEntrantEventList("Event 1");
        user.addEntrantEventList("Event 2");

        assertTrue(user.getEntrantEventList().contains("Event 1"));
        assertTrue(user.getEntrantEventList().contains("Event 2"));

        user.removeEntrantEventList(0);
        assertFalse(user.getEntrantEventList().contains("Event 1"));
        assertTrue(user.getEntrantEventList().contains("Event 2"));
    }

    /**
     * This tests our add and remove functiosn for organizer
     */
    @Test
    public void testAddAndRemoveOrganizerEvent() {
        user.addOrganizerEventList("Event A");
        user.addOrganizerEventList("Event B");

        assertTrue(user.getOrganizerEventList().contains("Event A"));
        assertTrue(user.getOrganizerEventList().contains("Event B"));

        user.removeOrganizerEventList(0);
        assertFalse(user.getOrganizerEventList().contains("Event A"));
        assertTrue(user.getOrganizerEventList().contains("Event B"));
    }

    /**
     * This tests our notification manager
     */
    @Test
    public void testNotificationManagement() {
        user.addNotification("New notification 1");
        user.addNotification("New notification 2");

        assertTrue(user.getNotifications().contains("New notification 1"));
        assertTrue(user.getNotifications().contains("New notification 2"));

        user.clearNotifications();
        assertTrue(user.getNotifications().isEmpty());
    }

    /**
     * This tests to see if our to map function
     */
    @Test
    public void testToMap() {
        user.addNotification("Test Notification");
        user.addEntrantEventList("Test Event");
        user.addOrganizerEventList("Organizer Event");

        Map<String, Object> userMap = user.toMap();

        assertNotNull(userMap);
        assertEquals("Test User", userMap.get("name"));
        assertEquals("test@user.com", userMap.get("email"));
        assertEquals("1234567890", userMap.get("phoneNumber"));
        assertEquals("test-user-id", userMap.get("uniqueId"));
        assertTrue((Boolean) userMap.get("entrant"));
        assertFalse((Boolean) userMap.get("organizer"));
        assertTrue((Boolean) userMap.get("notificationStatus"));
        assertEquals("#000000", userMap.get("colour"));
        assertTrue(userMap.containsKey("notifications"));
        assertTrue(userMap.containsKey("entrantEventList"));
        assertTrue(userMap.containsKey("organizerEventList"));
    }

    /**
     * This tests to see if we can add notifications
     */
    @Test
    public void testAddNotification() {
        user.addNotification("New notification");

        assertEquals(1, user.getNotifications().size());
        assertEquals("New notification", user.getNotifications().get(0));
    }


    // This method Designed via basic programming aids
    private Bitmap createSampleBitmap() {
        // Create a Bitmap from an empty byte array (this is just a placeholder)
        // In a real case, you might load a file or create a Bitmap differently.
        int width = 100;
        int height = 100;
        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        return bitmap;
    }
}
