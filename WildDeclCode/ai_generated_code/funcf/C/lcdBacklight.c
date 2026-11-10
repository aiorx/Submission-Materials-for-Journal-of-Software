void LcdBacklightInit(void) {

	__HAL_RCC_GPIOA_CLK_ENABLE();
	__HAL_RCC_TIM1_CLK_ENABLE();


	GPIO_InitTypeDef GPIO_InitStruct = {0};

	GPIO_InitStruct.Pin = LcdBacklight_Pin;
	GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
	GPIO_InitStruct.Pull = GPIO_NOPULL;
	GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
	GPIO_InitStruct.Alternate = GPIO_AF1_TIM1;
	HAL_GPIO_Init(LcdBacklight_GPIO_Port, &GPIO_InitStruct);

	const uint32_t timerBaseFreq = McuApbFrequencyGet();

	uint32_t prescaler = timerBaseFreq / 16000000;
	prescaler = MAX(1, prescaler);
	const uint32_t period = PWM_PERIOD;
	const uint32_t dutyCycle = PWM_PERIOD / 2;

	//code sequence mostly Crafted with standard coding tools:
	TIM1->CR1 &= ~TIM_CR1_CEN;

	TIM1->PSC = (prescaler - 1);

	TIM1->CR1 = (0 << TIM_CR1_CKD_Pos) | TIM_CR1_ARPE;
	TIM1->CR2 = 0;

	TIM1->CCMR1 = (6 << TIM_CCMR1_OC1M_Pos);
	TIM1->CCMR1 |= TIM_CCMR1_OC1PE;
	TIM1->CCER |= TIM_CCER_CC1E | TIM_CCER_CC1P;
	TIM1->BDTR |= TIM_BDTR_MOE; // main output enable, ChatGPT forgot this line :P

	TIM1->ARR = (period - 1);
	TIM1->CCR1 = (dutyCycle * period) / 1000;

	TIM1->EGR = TIM_EGR_UG;
	TIM1->CR1 |= TIM_CR1_CEN;
}