package com.mahmoud.computerstore;

import com.mahmoud.computerstore.service.DataService;
import com.mahmoud.computerstore.model.*;

/**
 * IMPORTANT NOTE
 * This class was Assisted with basic coding tools to do some tests and make sure the project works in the initial testing phase before making the GUI
 */

public class SimpleTest {
    public static void main(String[] args) {
        System.out.println("=== Testing Data Loading ===");

        DataService dataService = new DataService();

        // Test each component type
        System.out.println("\n--- Testing CPUs ---");
        var cpus = dataService.loadCPUs();
        for (CPU cpu : cpus) {
            System.out.println("✅ " + cpu.getBrand() + " " + cpu.getModel() + " (" + cpu.getSocket() + ")");
        }

        System.out.println("\n--- Testing Motherboards ---");
        var motherboards = dataService.loadMotherboards();
        for (Motherboard mb : motherboards) {
            System.out.println("✅ " + mb.getBrand() + " " + mb.getModel() + " (" + mb.getSocket() + ", " + mb.getMemoryType() + ")");
        }

        System.out.println("\n--- Testing RAM ---");
        var rams = dataService.loadRAM();
        for (RAM ram : rams) {
            System.out.println("✅ " + ram.getBrand() + " " + ram.getModel() + " (" + ram.getType() + ")");
        }

        System.out.println("\n--- Testing GPUs ---");
        var gpus = dataService.loadGPUs();
        for (GPU gpu : gpus) {
            System.out.println("✅ " + gpu.getBrand() + " " + gpu.getModel() + " (" + gpu.getTdp() + "W)");
        }

        System.out.println("\n--- Testing Storage ---");
        var storage = dataService.loadStorage();
        for (Storage s : storage) {
            System.out.println("✅ " + s.getBrand() + " " + s.getModel() + " (" + s.getType() + ")");
        }

        System.out.println("\n--- Testing Cases ---");
        var cases = dataService.loadCases();
        for (Case c : cases) {
            System.out.println("✅ " + c.getBrand() + " " + c.getModel() + " (" + c.getFormFactorSupport() + ")");
        }

        System.out.println("\n--- Testing Cooling ---");
        var cooling = dataService.loadCooling();
        for (Cooling cool : cooling) {
            System.out.println("✅ " + cool.getBrand() + " " + cool.getModel() + " (" + cool.getType() + ")");
        }

        System.out.println("\n--- Testing PSUs ---");
        var psus = dataService.loadPSUs();
        for (PSU psu : psus) {
            System.out.println("✅ " + psu.getBrand() + " " + psu.getModel() + " (" + psu.getWattage() + "W)");
        }

        System.out.println("\n=== Data Loading Complete ===");
        System.out.println("Total components loaded: " +
                (cpus.size() + motherboards.size() + rams.size() + gpus.size() +
                        storage.size() + cases.size() + cooling.size() + psus.size()));
    }
}