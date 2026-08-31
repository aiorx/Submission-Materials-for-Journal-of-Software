// Formed using common development resources to initialize the database with some data.


package com.ipi.gestionchampionnatapi.config;
import com.ipi.gestionchampionnatapi.model.*;
import com.ipi.gestionchampionnatapi.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner loadData(UtilisateurRepository utilisateurRepository,
                                      ChampionnatRepository championnatRepository,
                                      EquipeRepository equipeRepository,
                                      JourneeRepository journeeRepository,
                                      ResultatRepository resultatRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            // Création de plusieurs utilisateurs
            Utilisateur user1 = new Utilisateur("Doe", "John", "john.doe@example.com", passwordEncoder.encode("password"));
            Utilisateur user2 = new Utilisateur("Smith", "Jane", "jane.smith@example.com", passwordEncoder.encode("password"));
            Utilisateur user3 = new Utilisateur("Dupont", "Pierre", "pierre.dupont@example.com", passwordEncoder.encode("password"));
            Utilisateur user4 = new Utilisateur("Martin", "Alice", "alice.martin@example.com", passwordEncoder.encode("password"));
            utilisateurRepository.saveAll(Arrays.asList(user1, user2, user3, user4));

            // Création de championnats
            Championnat ligue1 = new Championnat("Ligue 1", LocalDate.of(2024, 8, 1), LocalDate.of(2025, 5, 31));
            Championnat premierLeague = new Championnat("Premier League", LocalDate.of(2024, 8, 1), LocalDate.of(2025, 5, 31), 5, -5, 0);
            Championnat serieA = new Championnat("Serie A", LocalDate.of(2024, 8, 1), LocalDate.of(2025, 5, 31), 5, 0, 2);
            Championnat bundesliga = new Championnat("Bundesliga", LocalDate.of(2024, 1, 20), LocalDate.of(2024, 12, 2));
            Championnat laLiga = new Championnat("La Liga", LocalDate.of(2024, 8, 1), LocalDate.of(2025, 5, 31), 5, 0, 2);
            championnatRepository.saveAll(Arrays.asList(ligue1, premierLeague, serieA, bundesliga, laLiga));

            // Création d'équipes pour chaque championnat

            // Ligue 1
            Equipe psg = new Equipe("Paris Saint-Germain");
            Equipe lyon = new Equipe("Olympique Lyonnais");
            Equipe marseille = new Equipe("Olympique de Marseille");
            equipeRepository.saveAll(Arrays.asList(psg, lyon, marseille));
            ligue1.addEquipe(psg);
            ligue1.addEquipe(lyon);
            ligue1.addEquipe(marseille);
            championnatRepository.save(ligue1);

            // Premier League
            Equipe arsenal = new Equipe("Arsenal");
            Equipe chelsea = new Equipe("Chelsea");
            Equipe manchesterUnited = new Equipe("Manchester United");
            equipeRepository.saveAll(Arrays.asList(arsenal, chelsea, manchesterUnited));
            premierLeague.addEquipe(arsenal);
            premierLeague.addEquipe(chelsea);
            premierLeague.addEquipe(manchesterUnited);
            championnatRepository.save(premierLeague);

            // Serie A
            Equipe juventus = new Equipe("Juventus");
            Equipe acMilan = new Equipe("AC Milan");
            Equipe interMilan = new Equipe("Inter Milan");
            equipeRepository.saveAll(Arrays.asList(juventus, acMilan, interMilan));
            serieA.addEquipe(juventus);
            serieA.addEquipe(acMilan);
            serieA.addEquipe(interMilan);
            championnatRepository.save(serieA);

            // Bundesliga
            Equipe bayern = new Equipe("Bayern Munich");
            Equipe dortmund = new Equipe("Borussia Dortmund");
            Equipe schalke = new Equipe("Schalke 04");
            equipeRepository.saveAll(Arrays.asList(bayern, dortmund, schalke));
            bundesliga.addEquipe(bayern);
            bundesliga.addEquipe(dortmund);
            bundesliga.addEquipe(schalke);
            championnatRepository.save(bundesliga);

            // La Liga
            Equipe realMadrid = new Equipe("Real Madrid");
            Equipe barcelona = new Equipe("FC Barcelona");
            Equipe atleticoMadrid = new Equipe("Atletico Madrid");
            equipeRepository.saveAll(Arrays.asList(realMadrid, barcelona, atleticoMadrid));
            laLiga.addEquipe(realMadrid);
            laLiga.addEquipe(barcelona);
            laLiga.addEquipe(atleticoMadrid);
            championnatRepository.save(laLiga);

            for (int i = 1; i <= 3; i++) {
                Journee journee = new Journee(i, ligue1);
                journeeRepository.save(journee);
                if (i == 1) {
                    // Journée 1
                    Resultat r1 = new Resultat(journee, psg, lyon, 2, 1);
                    Resultat r2 = new Resultat(journee, lyon, marseille, 1, 1);
                    resultatRepository.save(r1);
                    resultatRepository.save(r2);
                } else if (i == 2) {
                    // Journée 2
                    Resultat r1 = new Resultat(journee, marseille, psg, 0, 3);
                    Resultat r2 = new Resultat(journee, psg, lyon, 1, 1);
                    resultatRepository.save(r1);
                    resultatRepository.save(r2);
                } else {
                    // Journée 3
                    Resultat r1 = new Resultat(journee, lyon, psg, 1, 2);
                    Resultat r2 = new Resultat(journee, marseille, lyon, 2, 2);
                    resultatRepository.save(r1);
                    resultatRepository.save(r2);
                }
            }

            // Pour Premier League : 3 journées
            for (int i = 1; i <= 3; i++) {
                Journee journee = new Journee(i, premierLeague);
                journeeRepository.save(journee);
                if (i == 1) {
                    Resultat r1 = new Resultat(journee, arsenal, chelsea, 1, 0);
                    Resultat r2 = new Resultat(journee, chelsea, manchesterUnited, 2, 2);
                    resultatRepository.save(r1);
                    resultatRepository.save(r2);
                } else if (i == 2) {
                    Resultat r1 = new Resultat(journee, manchesterUnited, arsenal, 0, 1);
                    Resultat r2 = new Resultat(journee, chelsea, arsenal, 1, 1);
                    resultatRepository.save(r1);
                    resultatRepository.save(r2);
                } else {
                    Resultat r1 = new Resultat(journee, manchesterUnited, chelsea, 3, 1);
                    Resultat r2 = new Resultat(journee, arsenal, manchesterUnited, 2, 2);
                    resultatRepository.save(r1);
                    resultatRepository.save(r2);
                }
            }

            // Pour Serie A : 2 journées
            for (int i = 1; i <= 2; i++) {
                Journee journee = new Journee(i, serieA);
                journeeRepository.save(journee);
                Resultat r1 = new Resultat(journee, juventus, acMilan, 2, 2);
                Resultat r2 = new Resultat(journee, interMilan, juventus, 1, 3);
                resultatRepository.save(r1);
                resultatRepository.save(r2);
            }

            // Pour Bundesliga : 2 journées
            for (int i = 1; i <= 2; i++) {
                Journee journee = new Journee(i, bundesliga);
                journeeRepository.save(journee);
                Resultat r1 = new Resultat(journee, bayern, dortmund, 4, 0);
                Resultat r2 = new Resultat(journee, schalke, bayern, 0, 2);
                resultatRepository.save(r1);
                resultatRepository.save(r2);
            }

            // Pour La Liga : 2 journées
            for (int i = 1; i <= 2; i++) {
                Journee journee = new Journee(i, laLiga);
                journeeRepository.save(journee);
                Resultat r1 = new Resultat(journee, realMadrid, barcelona, 3, 1);
                Resultat r2 = new Resultat(journee, atleticoMadrid, realMadrid, 1, 2);
                resultatRepository.save(r1);
                resultatRepository.save(r2);
            }
        };
    }
}