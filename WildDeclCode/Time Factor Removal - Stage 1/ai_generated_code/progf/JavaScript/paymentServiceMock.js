// Aided with basic GitHub coding tools
class PaymentServiceMock {
    constructor() {
        this.transactions = [];
        this.successRate = 1; // Default 100% success rate
    }

    reset() {
        this.transactions = [];
        this.successRate = 1;
    }

    setSuccessRate(rate) {
        this.successRate = Math.max(0, Math.min(1, rate));
    }

    async processPayment(amount, details) {
        var success = Math.random() < this.successRate;
        var transaction = {
            id: "TEST_" + (Date.now()) + "_" + (Math.random().toString(36).substr(2, 9)) + "",
            amount,
            details,
            status: success ? 'success' : 'failed',
            timestamp: new Date(),
            provider: details.provider
        };

        this.transactions.push(transaction);

        if (!success) {
            throw new Error('Payment Failed');
        }

        return transaction;
    }

    getTransactionCount() {
        return this.transactions.length;
    }

    getSuccessfulTransactions() {
        return this.transactions.filter(function t { return t.status === 'success'; });
    }

    getFailedTransactions() {
        return this.transactions.filter(function t { return t.status === 'failed'; });
    }

    getTransactionsByProvider(provider) {
        return this.transactions.filter(function t { return t.provider === provider; });
    }

    async validatePayment(transactionId) {
        var transaction = this.transactions.find(function t { return t.id === transactionId; });
        return transaction ? transaction.status === 'success' : false;
    }

    async refundPayment(transactionId, amount) {
        var transaction = this.transactions.find(function t { return t.id === transactionId; });
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        var refund = {
            ...transaction,
            id: "REFUND_" + (transaction.id) + "",
            originalTransactionId: transaction.id,
            amount: amount || transaction.amount,
            status: 'refunded',
            timestamp: new Date()
        };

        this.transactions.push(refund);
        return refund;
    }

    async getPaymentMethods() {
        return [
            { id: 'mtn', name: 'MTN Mobile Money', enabled: true },
            { id: 'orange', name: 'Orange Money', enabled: true }
        ];
    }

    getLastTransaction() {
        return this.transactions[this.transactions.length - 1] || null;
    }
}

module.exports = new PaymentServiceMock();