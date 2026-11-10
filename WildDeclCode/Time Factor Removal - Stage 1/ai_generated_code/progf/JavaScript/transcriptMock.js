// Assisted using common GitHub development utilities

var mockTranscriptRequest = {
    processingTime: 'Super Fast',
    amount: 3000,
    paymentDetails: {
        cardNumber: '4242424242424242',
        expiryMonth: '12',
        expiryYear: '2024',
        cvv: '123'
    }
};

var mockVerificationRequest = {
    processingTime: 'Normal',
    amount: 10000,
    verifierEmail: 'verifier@example.com',
    paymentDetails: {
        cardNumber: '4242424242424242',
        expiryMonth: '12',
        expiryYear: '2024',
        cvv: '123'
    }
};

var mockFailedPaymentRequest = {
    processingTime: 'Fast',
    amount: 2000,
    paymentDetails: {
        cardNumber: '4000000000000002', // Test card that always fails
        expiryMonth: '12',
        expiryYear: '2024',
        cvv: '123'
    }
};

var mockCompletedTranscript = {
    _id: '507f1f77bcf86cd799439011',
    status: 'Completed',
    processingTime: 'Normal',
    amount: 1000,
    completedAt: new Date(),
    pdfDocument: Buffer.from('mock pdf content')
};

module.exports = {
    mockTranscriptRequest,
    mockVerificationRequest,
    mockFailedPaymentRequest,
    mockCompletedTranscript
};
