package tech.tolpuddle.faershaer_backend.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import tech.tolpuddle.faershaer_backend.domain.Person;
import tech.tolpuddle.faershaer_backend.domain.Reimbursement;
import tech.tolpuddle.faershaer_backend.domain.Transaction;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ReimbursementServiceTest {

    @Mock
    TxService txService;
    @Mock
    PersonService personService;
    @InjectMocks
    ReimbursementService rbService;

    Transaction createTransaction(Person payer, Double sum, String expense) {
        Transaction t = new Transaction();
        t.setSum(sum);
        t.setPayer(payer);
        t.setExpense(expense);
        return t;
    }

    @Test
    void shouldGenerateSimpleReimbursement() {
        Person p1 = new Person();
        p1.setName("Heinrich");

        Person p2 = new Person();
        p2.setName("Julius");

        Transaction t1 = createTransaction(p1, 500.0, "Currywurst");

        Mockito.when(personService.getAllPersons()).thenReturn(List.of(p1, p2));
        Mockito.when(txService.getAllTransactions()).thenReturn(List.of(t1));
        Mockito.when(txService.getBalance(p1)).thenReturn(500.0);
        Mockito.when(txService.getBalance(p2)).thenReturn(0.0);


        // Act
        List<Reimbursement> listRbs = rbService.getReimbursements();

        //Assert
        assertEquals(1, listRbs.size());
        assertEquals("Heinrich", listRbs.getFirst().getCreditor().getName());
        assertEquals("Julius", listRbs.getFirst().getDebtor().getName());
        assertEquals(250.0, listRbs.getFirst().getSum());
    }

    @Test
    void shouldGenerateThreeWayReimbursement() {
        Person p1 = new Person();
        p1.setName("Heinrich");
        Person p2 = new Person();
        p2.setName("Julius");
        Person p3 = new Person();
        p3.setName("Heinz");

        Transaction t1 = createTransaction(p1, 300.0, "Bier");
        Transaction t2 = createTransaction(p2, 240.0, "Gewurze");
        Transaction t3 = createTransaction(p3, 60.0, "Limonade");

        Mockito.when(personService.getAllPersons()).thenReturn(List.of(p1, p2, p3));
        Mockito.when(txService.getAllTransactions()).thenReturn(List.of(t1, t2, t3));
        Mockito.when(txService.getBalance(p1)).thenReturn(300.0);
        Mockito.when(txService.getBalance(p2)).thenReturn(240.0);
        Mockito.when(txService.getBalance(p3)).thenReturn(60.0);
        /*
            Fair share is 200 each
            Heinz should pay Heinrich 100 to bring Heinrich to 200
            Then, Heinz should pay Julius 40 to bring Julius to 200
            This will add 140 to Heinz' bill, which brings it to 200.
            The total reimbursement is 140.
         */

        //Act
        List<Reimbursement> listRbs = rbService.getReimbursements();

        //Assert
        assertEquals(2, listRbs.size());
        assertEquals("Heinrich", listRbs.getFirst().getCreditor().getName());
        assertEquals("Heinz", listRbs.getFirst().getDebtor().getName());
        assertEquals(100, listRbs.getFirst().getSum());

        assertEquals("Julius", listRbs.getLast().getCreditor().getName());
        assertEquals("Heinz", listRbs.getLast().getDebtor().getName());
        assertEquals(40, listRbs.getLast().getSum());

        assertEquals(140, listRbs.stream().map(Reimbursement::getSum).reduce(0.0, Double::sum));

    }

    @Test
    // Supported via standard programming aids
    void shouldGenerateFourWayReimbursement() {
        Person p1 = new Person();
        p1.setName("Alice");
        Person p2 = new Person();
        p2.setName("Bob");
        Person p3 = new Person();
        p3.setName("Charlie");
        Person p4 = new Person();
        p4.setName("Diana");

        Transaction t1 = createTransaction(p1, 500.0, "Groceries");
        Transaction t2 = createTransaction(p2, 300.0, "Utilities");
        Transaction t3 = createTransaction(p3, 200.0, "Cleaning");
        Transaction t4 = createTransaction(p4, 100.0, "Miscellaneous");

        Mockito.when(personService.getAllPersons()).thenReturn(List.of(p1, p2, p3, p4));
        Mockito.when(txService.getAllTransactions()).thenReturn(List.of(t1, t2, t3, t4));
        Mockito.when(txService.getBalance(p1)).thenReturn(500.0);
        Mockito.when(txService.getBalance(p2)).thenReturn(300.0);
        Mockito.when(txService.getBalance(p3)).thenReturn(200.0);
        Mockito.when(txService.getBalance(p4)).thenReturn(100.0);
    /*
        Fair share is 275 each
        Total reimbursement amount should be 250.
     */

        // Act
        List<Reimbursement> listRbs = rbService.getReimbursements();

        // Assert
        double totalBalance = 0;
        for (Reimbursement reimbursement : listRbs) {
            totalBalance += reimbursement.getSum();
        }

        assertEquals(250, totalBalance);
    }

    @Test
    // Supported via standard programming aids
    void shouldGenerateFiveWayReimbursement() {
        Person p1 = new Person();
        p1.setName("Eve");
        Person p2 = new Person();
        p2.setName("Frank");
        Person p3 = new Person();
        p3.setName("Grace");
        Person p4 = new Person();
        p4.setName("Hank");
        Person p5 = new Person();
        p5.setName("Ivy");

        Transaction t1 = createTransaction(p1, 150.0, "Dinner");
        Transaction t2 = createTransaction(p2, 150.0, "Drinks");
        Transaction t3 = createTransaction(p3, 150.0, "Snacks");
        Transaction t4 = createTransaction(p4, 150.0, "Dessert");
        Transaction t5 = createTransaction(p5, 150.0, "Supplies");

        Mockito.when(personService.getAllPersons()).thenReturn(List.of(p1, p2, p3, p4, p5));
        Mockito.when(txService.getAllTransactions()).thenReturn(List.of(t1, t2, t3, t4, t5));
        Mockito.when(txService.getBalance(p1)).thenReturn(150.0);
        Mockito.when(txService.getBalance(p2)).thenReturn(150.0);
        Mockito.when(txService.getBalance(p3)).thenReturn(150.0);
        Mockito.when(txService.getBalance(p4)).thenReturn(150.0);
        Mockito.when(txService.getBalance(p5)).thenReturn(150.0);
    /*
        Fair share is 150 each
        Total reimbursement amount should be 0.
     */

        // Act
        List<Reimbursement> listRbs = rbService.getReimbursements();

        // Assert
        double totalBalance = 0;
        for (Reimbursement reimbursement : listRbs) {
            totalBalance += reimbursement.getSum();
        }

        assertEquals(0, totalBalance);
    }

    @Test
    // Supported via standard programming aids
    void shouldGenerateSixWayReimbursement() {
        Person p1 = new Person();
        p1.setName("John");
        Person p2 = new Person();
        p2.setName("Jane");
        Person p3 = new Person();
        p3.setName("Jim");
        Person p4 = new Person();
        p4.setName("Jill");
        Person p5 = new Person();
        p5.setName("Jack");
        Person p6 = new Person();
        p6.setName("Jenny");

        Transaction t1 = createTransaction(p1, 600.0, "Vacation");
        Transaction t2 = createTransaction(p2, 300.0, "Food");
        Transaction t3 = createTransaction(p3, 150.0, "Drinks");
        Transaction t4 = createTransaction(p4, 100.0, "Gifts");
        Transaction t5 = createTransaction(p5, 50.0, "Souvenirs");
        Transaction t6 = createTransaction(p6, 0.0, "Miscellaneous");

        Mockito.when(personService.getAllPersons()).thenReturn(List.of(p1, p2, p3, p4, p5, p6));
        Mockito.when(txService.getAllTransactions()).thenReturn(List.of(t1, t2, t3, t4, t5, t6));
        Mockito.when(txService.getBalance(p1)).thenReturn(600.0);
        Mockito.when(txService.getBalance(p2)).thenReturn(300.0);
        Mockito.when(txService.getBalance(p3)).thenReturn(150.0);
        Mockito.when(txService.getBalance(p4)).thenReturn(100.0);
        Mockito.when(txService.getBalance(p5)).thenReturn(50.0);
        Mockito.when(txService.getBalance(p6)).thenReturn(0.0);
    /*
        Fair share is 200 each
        Total reimbursement amount should be 500.
     */

        // Act
        List<Reimbursement> listRbs = rbService.getReimbursements();

        // Assert
        double totalBalance = 0;
        for (Reimbursement reimbursement : listRbs) {
            totalBalance += reimbursement.getSum();
        }

        assertEquals(500, totalBalance);
    }

}