```c
void SeqStart(uint32_t pwmDivider, uint32_t seqMax, uint8_t * fifoBuffer, size_t fifoLen) {
	HAL_NVIC_DisableIRQ(TIM2_IRQn);

	FifoInit(&g_sequence, fifoBuffer, fifoLen);

	__HAL_RCC_GPIOB_CLK_ENABLE();
	__HAL_RCC_TIM16_CLK_ENABLE();
	__HAL_RCC_TIM3_CLK_ENABLE();

	GPIO_InitTypeDef GPIO_InitStruct = {0};
	GPIO_InitStruct.Pin = GPIO_PIN_4;
	GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
	GPIO_InitStruct.Pull = GPIO_NOPULL;
	GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
	GPIO_InitStruct.Alternate = GPIO_AF2_TIM3;
	HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);
	//code sequence mostly Crafted with standard coding tools:
	//Timer for PWM
	TIM3->CR1 &= ~TIM_CR1_CEN;
	TIM3->PSC = pwmDivider;
	TIM3->CR1 = (0 << TIM_CR1_CKD_Pos) | TIM_CR1_ARPE;
	TIM3->CR2 = 0;
	TIM3->CCMR1 = (6 << TIM_CCMR1_OC1M_Pos); //PWM mode 1
	TIM3->CCMR1 |= TIM_CCMR1_OC1PE; //use preload
	TIM3->CCER |= TIM_CCER_CC1E | TIM_CCER_CC1P;
	TIM3->BDTR |= TIM_BDTR_MOE; // main output enable, ChatGPT forgot this line :P
	TIM3->ARR = 255; //maximum PWM value
	TIM3->CCR1 = 128; //actual compare value
	TIM3->EGR = TIM_EGR_UG; //update event generation
	TIM3->CR1 |= TIM_CR1_CEN;

	//Timer for ISR data feeder
	TIM16->CR1 = 0; //all stopped
	TIM16->CR2 = 0;
	TIM16->CNT = 0;
	TIM16->PSC = 0;
	TIM16->SR = 0;
	TIM16->DIER = TIM_DIER_UIE;
	TIM16->ARR = seqMax;
	HAL_NVIC_SetPriority(TIM1_UP_TIM16_IRQn, 4, 0);
	HAL_NVIC_EnableIRQ(TIM1_UP_TIM16_IRQn);
	TIM16->CR1 |= TIM_CR1_CEN;
}
```