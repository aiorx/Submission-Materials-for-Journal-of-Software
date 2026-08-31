// Based on code Assisted with basic coding tools (OpenAI), modified by me (line 54 -75)
      
   JPanel panel = new JPanel();
   panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS)); 
  JLabel prompt = new JLabel("Please enter your South African phone number:");
  JPanel inputRow = new JPanel(); 
  JLabel label = new JLabel("+27");
  JTextField textField = new JTextField(10);
  inputRow.add(label);
  inputRow.add(textField);
  panel.add(prompt);     
  panel.add(inputRow);   
  int result = JOptionPane.showConfirmDialog(null, panel, 
      "Phone Number", JOptionPane.OK_CANCEL_OPTION);

  String fullPhoneNumber = ""; 
      if (result == JOptionPane.OK_OPTION) {
          String userInput = textField.getText();
          fullPhoneNumber = "+27" + userInput;
  
}