/**
    Identifies applicant attributes from the input file to define Applicant objects.
    Pre-condition: The file path must be valid.
    Post-condition: A list with Applicant objects created for each applicant to the company.
    
    @param filePath - the String file path for the inputed file where the hiring data is stored
    @return list - the ArrayList that stores the Applicant objects created from the hiring data
    */
    public ArrayList<Applicant> loadApplicants(String filePath) throws FileNotFoundException{
        ArrayList<Applicant> list = new ArrayList<>();
        File file = new File(filePath);
        try(Scanner scan = new Scanner(file)){
            
            //Start of code Adapted from standard coding samples
            //while the file has a line of applicant data
            while (scan.hasNextLine()){
                String line = scan.nextLine().trim();
                //if the line is empty, skip to next line and check again
                if (line.isEmpty()) continue;
                //divide the line in the txt file into a String array, each String is seperated by a comma
                String[] parts = line.split(",");
                //Assign values to variables base on the array parts, parsing to an int when necessary
                String name = parts[0];
                int age = Integer.parseInt(parts[1]);
                String gender = parts[2];
                String race = parts[3];
                String education = parts[4];
                int experience = Integer.parseInt(parts[5]);
                String position = parts[6];
                //end of code Adapted from standard coding samples
                
                /*if the applicant is applying to be an intern, assign the last few Strings in the parts array
                to the variables and create an InterApplicant object using the variables*/
                if (position.equalsIgnoreCase("Intern")){
                    int gpa = Integer.parseInt(parts[7]);
                    Applicant a = new InternApplicant(name, age, gender, race, education, experience, gpa);
                    //add the Applicant object to the ArrayList list
                    list.add(a);
                }
                /*if the applicant is applying to be a manager, assign the last few Strings in the parts array
                to the variables and create a Manager Applicant object using the variables*/
                if (position.equalsIgnoreCase("Manager")){
                    int lE = Integer.parseInt(parts[7]);
                    String[] certArray = parts[8].split(";");
                    ArrayList<String> certifications = new ArrayList<>();
                    for (String cert : certArray) {
                        certifications.add(cert.trim());
                    }
                    Applicant a = new ManagerialApplicant(name, age, gender, race, education, experience, lE, certifications);
                    //add the Applicant object to the ArrayList list
                    list.add(a);
                }
                
                /*if the applicant is applying to be a manager, assign the last few Strings in the parts array
                to the variables and create a Technical Applicant object using the variables*/
                if(position.equalsIgnoreCase("Software Engineer")){
                    String[] programLang = parts[7].split(";");
                    ArrayList<String> pL = new ArrayList<>();
                    for (String p : programLang) {
                        pL.add(p.trim());
                    }
                    String[] certArray = parts[8].split(";");
                    ArrayList<String> certifications = new ArrayList<>();
                    for (String cert : certArray) {
                        certifications.add(cert.trim());
                    }
                    Applicant a = new TechnicalApplicant(name, age, gender, race, education, experience, pL, certifications);
                    //add the Applicant object to the ArrayList list
                    list.add(a);
                }
            }
        }
        return list;
    }