/*
    public static void LiteratureLoader() {
        Question temp = new Question();
        temp.setQuestion("Wer schrieb das Buch namens Faust?");                     //questions and answers Built using outside development resources's GPT-3.5
        temp.getAnswers().add("Johann Wolfgang von Goethe");                        //correct answer first!!
        temp.getAnswers().add("Thomas Brezina");
        temp.getAnswers().add("Friedrich Schiller");
        temp.getAnswers().add("Heinrich Heine");
        fullPool.add(temp);

        //copy following code for new question:
        temp = new Question();
        temp.setQuestion("Welcher der folgenden ist keine literarische Epoche?");
        temp.getAnswers().add("Rassismus");
        temp.getAnswers().add("Realismus");
        temp.getAnswers().add("Expressionismus");
        temp.getAnswers().add("Romantik");
        fullPool.add(temp);

        temp = new Question();
        temp.setQuestion("Welches Werk stammt von William Shakespeare?");
        temp.getAnswers().add("Romeo und Julia");
        temp.getAnswers().add("Harry Potter");
        temp.getAnswers().add("Der große Gatsby");
        temp.getAnswers().add("Krieg und Frieden");
        fullPool.add(temp);

        temp = new Question();
        temp.setQuestion("Wer schrieb 'Die Odyssee'?");
        temp.getAnswers().add("Homer");
        temp.getAnswers().add("Virgil");
        temp.getAnswers().add("Dante Alighieri");
        temp.getAnswers().add("Hermann Hesse");
        fullPool.add(temp);

        temp = new Question();
        temp.setQuestion("Welches Buch wurde von Jane Austen geschrieben?");
        temp.getAnswers().add("Stolz und Vorurteil");
        temp.getAnswers().add("Der Graf von Monte Christo");
        temp.getAnswers().add("Faust");
        temp.getAnswers().add("Anna Karenina");
        fullPool.add(temp);

        temp = new Question();
        temp.setQuestion("In welchem Land spielt 'Die Verwandlung' von Franz Kafka?");
        temp.getAnswers().add("Tschechien");
        temp.getAnswers().add("Deutschland");
        temp.getAnswers().add("Österreich");
        temp.getAnswers().add("Russland");
        fullPool.add(temp);

        temp = new Question();
        temp.setQuestion("Wer ist der Autor von '1984'?");
        temp.getAnswers().add("George Orwell");
        temp.getAnswers().add("Aldous Huxley");
        temp.getAnswers().add("Ray Bradbury");
        temp.getAnswers().add("Philip K. Dick");
        fullPool.add(temp);

        temp = new Question();
        temp.setQuestion("Welches Buch wird oft als 'Der Große Gatsby' bezeichnet?");
        temp.getAnswers().add("F. Scott Fitzgerald");
        temp.getAnswers().add("Ernest Hemingway");
        temp.getAnswers().add("Mark Twain");
        temp.getAnswers().add("J.D. Salinger");
        fullPool.add(temp);

        temp = new Question();
        temp.setQuestion("Wer schrieb 'Die Leiden des jungen Werthers'?");
        temp.getAnswers().add("Johann Wolfgang von Goethe");
        temp.getAnswers().add("Franz Kafka");
        temp.getAnswers().add("Thomas Mann");
        temp.getAnswers().add("Friedrich Schiller");
        fullPool.add(temp);

        temp = new Question();
        temp.setQuestion("Was ist das bekannteste Werk von Leo Tolstoi?");
        temp.getAnswers().add("Krieg und Frieden");
        temp.getAnswers().add("Anna Karenina");
        temp.getAnswers().add("Auferstehung");
        temp.getAnswers().add("Kinderbuch");
        fullPool.add(temp);

        temp = new Question();
        temp.setQuestion("Welches Buch erzählt die Geschichte von Pip und Magwitch?");
        temp.getAnswers().add("Große Erwartungen");
        temp.getAnswers().add("Sturmhöhe");
        temp.getAnswers().add("Jane Eyre");
        temp.getAnswers().add("David Copperfield");
        fullPool.add(temp);

        temp = new Question();
        temp.setQuestion("Wer schrieb 'Der kleine Prinz'?");
        temp.getAnswers().add("Antoine de Saint-Exupéry");
        temp.getAnswers().add("Jules Verne");
        temp.getAnswers().add("Hans Christian Andersen");
        temp.getAnswers().add("Gabriel García Márquez");
        fullPool.add(temp);
    }