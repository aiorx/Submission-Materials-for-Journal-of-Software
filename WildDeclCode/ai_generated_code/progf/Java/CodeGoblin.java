/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Enemies;

import java.util.Random;

import Character.PlayerStats;

/**
 *
 * @Author David
 * @Edited by David and Adrian
 * @FocusedOn by David
 * @Status Commented and Finished
 *
 * Enemy Name and Printed Texted Assisted with basic coding tools
 * "Code Goblin" and text like "Code Goblin attacks with Code Slash"
 */
public class CodeGoblin extends Enemy {
    private final PlayerStats player;
    
    public CodeGoblin(PlayerStats player) {
        super("Code Goblin", 5, 10, 1, 5, 35, 7, 2);
        this.player = player;
    }
    //Name, XpMinDrop, XpMaxDrop, CoinMinDrop, CoinMax Drop, Health, Speed, Defense
    
    @Override
    public void choice() {
        Random random = new Random();
        int action = random.nextInt(3);
        
        switch (action) {
            case 0:
                attack();
                break;
            case 1:
                specialAttack();
                break;
            case 2:
                defend();
                break;
        }           
    }
    
    // --- Calculation of Damage ---
    
    private int calculateDamage(int minDamage, int maxDamage) {
        Random random = new Random();
        int damage = random.nextInt(maxDamage - minDamage + 1) + minDamage - player.getDefense();
        /*
        Damage =
            + Random Damage Between Max and Min
            + Minimum Damage
            - Player's Defense Value
        */
        
        if (damage < 0) {
            damage = 0;
        }
        //Prevents negative damage from accidentally healing the Player
        
        return damage;
    }
    
    // --- 3 Moves available for Code Goblin ---
    
    @Override
    public void attack() 
    {
        evasionCheck();
        
        System.out.println("Code Goblin attacks with Code Slash!");
        int damage = calculateDamage(10, 15);
        
        System.out.println("Code Slash deals " + damage + " damage!");
        System.out.println("====================");
        
        player.takeDamage(damage);
        addTimeUnit(80);
        
        
        slowedCheck();
        burningCheck();
        poisonedCheck();
    }

    @Override
    public void specialAttack() {
        evasionCheck();
        
        System.out.println("Code Goblin uses Sneaky Backstab!");
        int damage = calculateDamage(15, 20);
        
        System.out.println("Sneaky Backstab deals " + damage + " damage!");
        System.out.println("====================");
        
        player.takeDamage(damage);
        addTimeUnit(140);
        
        
        slowedCheck();
        burningCheck();
        poisonedCheck();
    }

    @Override
    public void defend() {
        if (getIsEvading() == true) {
            System.out.println("Code Goblin continues to defend with Evasive Roll!");
        } else {
            System.out.println("Code Goblin defends with Evasive Roll!");
        }
        System.out.println("====================");
        
        this.isEvadingTrue();
        addTimeUnit(40);
        
        
        slowedCheck();
        burningCheck();
        poisonedCheck();
    }
    
    // -- Methods Effects --

    public void evasionCheck() {
        if (getIsEvading() == true) {
            isEvadingFalse();
            System.out.println("Code Goblin finshes their Evasive Roll");
            System.out.println("====================");
            
        }
        //Finish Evasion before Attacking
    }
    
    @Override
    public void slowedCheck() {
        if (getIsSlowed() == true) {
            resetSpeed();
            System.out.println("Code Goblin returns to normal speed!");
            System.out.println("====================");
            
        }
        //Finishing turn removes slowed effect
    }

    @Override    
    public void burningCheck() {
        final int BURN_DAMAGE = 6;
        
        if (getIsBurning() == true) {
            isBurningFalse();
            this.takeDamage(BURN_DAMAGE);
            System.out.println("Code Goblin took " + BURN_DAMAGE + " Burning Damage and slowed");
            System.out.println("====================");
            
        }
        //Finishing turn deals burn damage
    }
    
    @Override
    public void poisonedCheck() {
        final int POISON_DAMAGE = 3;
        
        if (getIsPoisoned() == true) {
            isPoisonedFalse();
            this.takeDamage(POISON_DAMAGE);
            System.out.println("Code Goblin took " + POISON_DAMAGE + " Burning Damage");
            System.out.println("====================");
            
        }
        //Finishing turn deals poison damage
    }
}