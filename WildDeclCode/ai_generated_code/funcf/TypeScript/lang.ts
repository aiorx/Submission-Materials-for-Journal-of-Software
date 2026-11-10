```typescript
export const submitLanguage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // Get the language from the request body.
  const lang: string | undefined | null = req.body.lang;

  // Check if the language was provided in the request.
  if (lang === undefined || lang === null) {
    res.status(400).send("Invalid request. Expected a language, found nothing.");
    return;
  }

  // Check if the length of the language is within the acceptable range.
  console.log(lang, lang.length);
  if (lang.length === 0) {
    res.status(400).send("The length of the language shouldn't be of length 0");
    return;
  }

  // Check if the length of the language is within the acceptable range.
  if (lang.length > 16) {
    res.status(400).send("The length of the language shouldn't exceed 16 chars.");
    return;
  }

  // Aided using common development resources
  // vvvvvvvvvvvvvvvvvvv
  const bad_words = [
    "shit",
    "bitch",
    "asshole",
    "bastard",
    "cunt",
    "dick",
    "pussy",
    "whore",
    "slut",
    "faggot",
    "nigger",
    "retard",
    "spastic",
    "mongoloid",
    "cripple",
    "moron",
    "idiot",
    "imbecile",
    "stupid",
    "dumb",
    "ignorant",
    "fatso",
    "ugly",
    "weirdo",
    "psycho",
    "nutjob",
    "loon",
    "crazy",
    "enculé",
    "enculée",
    "connard",
    "connasse",
    "salope",
    "putain",
    "pute",
    "merde",
    "enculer",
    "niquer",
    "baiser",
    "trou du cul",
    "bite",
    "foutre",
    "suce",
    "sucer",
    "salaud",
    "chiennasse",
    "pétasse",
    "enculage",
    "enculée",
    "nique",
    "baise",
    "salop",
    "branleur",
    "branleuse",
    "trouduc",
    "pédé",
    "pédale",
    "pd",
    "tapette",
    "folle",
    "folle furieuse",
    "folle dingue",
    "folle à lier",
    "malade mentale",
    "malade",
    "tarée",
    "taré",
    "tarée mentale",
    "taré mental",
    "handicapé",
    "handicapée",
    "mongol",
    "mongole",
    "débile",
    "débile mentale",
    "débile mental",
    "con",
    "conne",
    "imbécile",
    "abruti",
    "abruti(e)",
    "couillon",
    "couillonne",
    "crotte",
    "enculé de ta mère",
    "pute de ta mère",
    "nique ta mère",
    "fils de pute",
    "fils de chienne",
    "connard de ta mère",
    "merdeux",
    "merdeuse",
    "merdeuse",
    "va te faire enculer",
    "va te faire foutre",
    "va niquer ta mère",
    "t'es qu'un connard",
    "t'es qu'une connasse",
    "t'es qu'une salope",
    "t'es qu'un enfoiré",
    "je m'en bats les couilles",
    "je m'en bats les steaks",
    "je m'en fous",
    "j'en ai rien à foutre",
    "j'en ai rien à cirer",
    "j'en ai rien à taper",
    "je m'en bats l'oeil",
    "je m'en bats les reins",
    "je m'en bats les c*******",
    "aller se faire voir",
    "aller au diable",
    "aller se faire foutre",
    "aller se faire enculer",
    "aller se faire niquer",
    "vas te faire voir",
    "vas au diable",
    "vas te faire foutre",
    "vas te faire enculer",
    "vas te faire niquer",
    "nique ta mère",
    "nique ta grand-mère",
    "nique ta race",
    "suce ma bite",
    "suce ma queue",
    "suce moi",
    "baise ta mère",
    "baise ta grand-mère",
    "baise ta race",
    "ferme ta gueule",
    "ferme ta bouche",
    "ta gueule",
    "nique toi",
    "va niquer ta mère",
    "va niquer ta grand-mère",
    "va niquer ta race",
    "tête de gland",
    "cul terreux",
    "cul terre à terre",
    "trouduc",
    "casse-toi",
    "dégage",
    "fous le camp",
    "va-t-en",
    "connard",
    "connasse",
    "salope",
    "putain",
    "pute",
    "merde",
    "enculer",
    "niquer",
    "baiser",
    "trou du cul",
    "bite",
    "foutre",
    "suce",
    "sucer",
    "salaud",
    "chiennasse",
    "pétasse",
    "enculage",
  ];

  // If there is in fact a bad word,
  if (bad_words.includes(lang) || bad_words.some((word) => lang.includes(word))) {
    // Remove the right to vote of the user
    conn.execute("UPDATE Users SET vote_right = 0 WHERE token = ?", [req.token]);

    // Notify it to him
    res
      .status(403)
      .send(
        "We detected that you tried to put innapropriate words and not a language. You don't have the right to add languages anymore. If you think that this is an error, contact an administrator.",
      );
  }

  // Get the current phase of the language submission process.
  conn.execute(
    `
        SELECT
            id,
            CASE
                WHEN NOW() < phase2 THEN 1
                WHEN NOW() < phase3 THEN 2
                WHEN NOW() < phase4 THEN 3
                WHEN NOW() < phaseend THEN 4
                ELSE -1
            END AS current_phase
        FROM Phases
        WHERE NOW() > phase1
        ORDER BY id DESC
        LIMIT 1`,
    async (err2, rep2: any[]) => {
      if ((err2 !== undefined && err2 !== null) || rep2 === undefined) {
        res.status(500).send("An internal error occured while trying to get the current phase.");
        console.error(err2);
        return;
      }

      // If there is no phase.
      if (rep2.length === 0) {
        res.status(404).send("No phases found.");
        return;
      }

      // If it's not the first phase
      if (rep2[0].current_phase !== 1) {
        res
          .status(503)
          .send(`You can not suggest new languages during phase ${rep2[0].current_phase}`);
      }

      // Check if the language already exists in either the CurrentLang or SuggestionLang table.
      conn.execute(
        `
                SELECT EXISTS(
                    SELECT 1 FROM CurrentLang WHERE LOWER(lang) = ?
                    UNION
                    SELECT 1 FROM SuggestionLang WHERE LOWER(lang) = ? AND phase_id = ? 
                ) as exists_lang
                `,
        [lang.toLowerCase(), lang.toLowerCase(), rep2[0].id],
        async (err, rep) => {
          if (err || rep === undefined || rep === null) {
            res
              .status(500)
              .send(
                "An internal error occured while trying to get languages with the name of " + lang,
              );
            console.log(err);
            return;
          }

          // If there is a conflict with a language having the same name.
          if (rep[0].exists_lang === 1) {
            res.status(409).send("A language already exists with that name.");
            return;
          }

          // Get the user ID associated with the token provided in the request.
          conn.execute(
            "SELECT id, vote_right FROM Users WHERE token = ? LIMIT 1",
            [req.token],
            async (err3, rep3: any[]) => {
              if ((err3 !== undefined && err3 !== null) || rep3 === undefined) {
                res.status(500).send("An internal error occured while trying to get your token.");
                console.error(err3);
                return;
              }

              // If no user
              if (rep3.length === 0) {
                res.status(404).send("No user found.");
                return;
              }

              // If the user doesn't have the right to vote
              if (rep3[0].vote_right === 0) {
                res.status(403).send("You don't have the right to vote, due to past activites.");
                return;
              }

              // Check if the user has already submitted the maximum number of language suggestions.
              conn.execute(
                "SELECT COUNT(*) as suggestions FROM SuggestionLang WHERE owner_id = ? AND phase_id = ?",
                [rep3[0].id, rep2[0].id],
                async (err4, rep4: any[]) => {
                  // If it's an invalid response
                  if ((err4 !== undefined && err4 !== null) || rep4 === undefined) {
                    res
                      .status(500)
                      .send(
                        "An internal error occured while trying to get the number of suggested lang.",
                      );
                    console.error(err4);
                    return;
                  }

                  // If there is less than 3 languages suggestion
                  if (rep4.length === 0 || rep4[0].suggestions < 3) {
                    // Insert it in the DB
                    conn.execute(
                      "INSERT INTO SuggestionLang (lang, owner_id, phase_id) VALUES (?, ?, ?)",
                      [lang, rep3[0].id, rep2[0].id],
                    );
                    // Return to the user that the lang has been """created"""
                    res.status(201).send("Lang created successfully.");
                  } else {
                    res.status(429).send("You can only submit 3 languages.");
                  }
                },
              );
            },
          );
        },
      );
    },
  );
};
```