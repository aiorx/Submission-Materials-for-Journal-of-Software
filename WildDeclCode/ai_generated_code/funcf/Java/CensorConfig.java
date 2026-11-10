```java
public String censorBadText(String text){
    if(text == null || text.isEmpty()){
        return "";
    }
    else {
        String[] censoredText = {
                "fuck", "shit", "cunt", "arse", "ass", "shite", "sh1t", "5hit", "5h1t", "ar5e", "a55", "a5s", "as5", "wank", "fuck", "shit", "bitch", "asshole", "bastard", "crap", "dickhead",
                "motherfucker", "piss", "twat", "wanker", "bollocks", "bugger", "nigger", "chink", "faggot", "queer", "kike", "wetback", "gook",
                "raghead", "tarbaby", "tranny", "heeb", "slant", "gypsy", "porn", "dick", "pussy", "blowjob", "anal", "cum", "tits",
                "nipple", "vagina", "penis", "whore", "slut", "fisting", "handjob", "masturbate", "orgasm", "boner", "buttfuck", "clit", "dildo", "ejaculate",
                "hentai", "stripper", "buttplug", "fellatio", "cunnilingus", "bukkake", "pegging", "rimjob" //can add more if needed but I think this is enough, thanks chatGpt for saving me writing out those...
        };

        String patternString = "(" + String.join("|", censoredText) + ")";
        Pattern pattern = Pattern.compile(patternString, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        StringBuilder censoredTextSb = new StringBuilder();

        while (matcher.find()) {
            String replacement = "*".repeat(matcher.group().length());
            matcher.appendReplacement(censoredTextSb, replacement);
        }
        matcher.appendTail(censoredTextSb);
        return censoredTextSb.toString();
    }
}
```