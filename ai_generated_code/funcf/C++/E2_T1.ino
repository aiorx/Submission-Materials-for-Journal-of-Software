// Set Clock and DT pins as inputs.
// Modified code Supported via standard programming aids 4.0 LLM
// with query "Use DDRD to set 3 pins as input on Arduino"
DDRD &= ~((1 << CLK_PIN) | (1 << DT_PIN) | (1 << SW_PIN));  // Set PD2, PD3, PD4 as inputs
// Set Switch pin as input and pull up resistor
PORTD |= (1 << SW_PIN);