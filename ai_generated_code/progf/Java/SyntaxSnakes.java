/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Enemies;

import java.util.Random;

import Character.PlayerStats;
import Main.Mechanics;

/**
 *
 * @Author David
 * @Edited by David and Adrian
 * @FocusedOn by David
 * @Status Commented and Finished
 *
 * Enemy Name and Printed Texted Aided using common development resources
 * "Syntax Snakes" and text like "Syntax Snakes attacks with Syntax Bite"
 */

public class SyntaxSnakes extends Enemy {
    private final PlayerStats player;
        
        
    public SyntaxSnakes(PlayerStats player) {
        super("Syntax Snakes", 5, 10, 1, 5, 26, 10, 2);
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
    
    // --- 3 Moves available for Syntax Snakes ---

    @Override
    public void attack() {
        defendingCheck();
        
        System.out.println("Syntax Snakes attack with Syntax Bite!");
        int damage = calculateDamage(10, 15);
        
        System.out.println("Syntax Bite deals " + damage + " damage!");
        System.out.println("====================");
        
        player.takeDamage(damage);
        addTimeUnit(70);
        
        
        slowedCheck();
        burningCheck();
        poisonedCheck();
    }

    @Override
    public void specialAttack() {
        defendingCheck();
                
        System.out.println("Syntax Snakes use Poisonous Strike!");
        int damage = calculateDamage(15, 20); 
        
        System.out.println("Poisonous Strike deals " + damage + " damage!");
        System.out.println("====================");
        
        player.takeDamage(damage);
        addTimeUnit(135);
        player.isPoisonedTrue();
        
        
        slowedCheck();
        burningCheck();
        poisonedCheck();
    }

    @Override
    public void defend() {
        if (getIsDefending() == true) {
            System.out.println("Syntax Snakes continues to defend with Coiling Defense!");
        } else {
            System.out.println("Syntax Snakes defend with Coiling Defense!");
        }
        System.out.println("====================");

        this.increaseDefense(10);
        addTimeUnit(20);
        
        
        slowedCheck();
        burningCheck();
        poisonedCheck();
    }
    
       // -- Methods Effects --

    public void defendingCheck() {
        if (getIsDefending() == true) {
            isDefendingFalse();
            System.out.println("Syntax Snakes finshes their Coiling Defense");
            System.out.println("====================");
            
        }
        //Finish Defense before Attacking
    }
    
    @Override
    public void slowedCheck() {
        if (getIsSlowed() == true) {
            resetSpeed();
            System.out.println("Syntax Snakes returns to normal speed!");
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
            System.out.println("Syntax Snakes took " + BURN_DAMAGE + " Burning Damage");
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
            System.out.println("Syntax Snakes took " + POISON_DAMAGE + " Poison Damage and slowed");
            System.out.println("====================");
            
        }
        //Finishing turn deals poison damage
    }
}