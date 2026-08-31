/*A vendor offers software services to a client. Each resource is billed at some dollar rate per hour. 
The total cost of the project for the client is therefore, 
the total number of hours contributed by all the vendor resources * the dollar rate / hour. There are however some variants.
 a. The vendor might have purchased hardware/infrastructure or software licenses needed for the project. 

 b. The vendor might have utilized external consultants for the project. 

 c. The client looks at the vendor as a one stop solution and hence external resources employed by the vendor need to be paid by
  the vendor. 

 d. It might however be possible that the vendor’s hardware and software purchases are borne by the client. 
 In this case, the client pays the vendor 30% of the hardware/infrastructure costs. In case of software licenses, 
 the client pays the vendor 50% of the cost, if they are commonly available and used, or 100% if the software is infrequently
 used or is proprietary client technology. 


 e. The external consultants employed by the vendor will come at a dollar rate per hour. 

 f. Accept the suitable inputs and display the profits / loss realized by the vendor */

//Adapted from standard coding samples
#include <stdio.h>

int main() {
    // Declare variables
    double vendor_hours, hourly_rate;
    double hardware_cost, software_cost, consultant_hours, consultant_rate;
    int hardware_client_pays, software_type;
    double total_cost = 0, total_revenue = 0, profit_or_loss = 0;

    // Input: Vendor's resource cost
    printf("Enter total hours worked by vendor resources: ");
    scanf("%lf", &vendor_hours);
    printf("Enter hourly rate of vendor resources: ");
    scanf("%lf", &hourly_rate);

    // Input: Hardware costs
    printf("Enter hardware/infrastructure cost: ");
    scanf("%lf", &hardware_cost);
    printf("Is the hardware cost borne by the client? (1 for Yes, 0 for No): ");
    scanf("%d", &hardware_client_pays);

    // Input: Software costs
    printf("Enter software license cost: ");
    scanf("%lf", &software_cost);
    printf("Enter software type (1 for common, 2 for infrequent/proprietary): ");
    scanf("%d", &software_type);

    // Input: External consultant costs
    printf("Enter hours worked by external consultants: ");
    scanf("%lf", &consultant_hours);
    printf("Enter hourly rate of external consultants: ");
    scanf("%lf", &consultant_rate);

    // Calculate total revenue
    total_revenue = vendor_hours * hourly_rate;

    // Calculate additional costs
    double hardware_client_contribution = 0;
    if (hardware_client_pays == 1) {
        hardware_client_contribution = hardware_cost * 0.30; // Client pays 30% of hardware cost
    }
    double software_client_contribution = 0;
    if (software_type == 1) {
        software_client_contribution = software_cost * 0.50; // Client pays 50% for common software
    } else if (software_type == 2) {
        software_client_contribution = software_cost * 1.0; // Client pays 100% for proprietary software
    }

    // Calculate total costs
    total_cost = (vendor_hours * hourly_rate) + hardware_cost + software_cost +
                 (consultant_hours * consultant_rate);

    // Subtract client contributions from costs
    total_cost -= (hardware_client_contribution + software_client_contribution);

    // Calculate profit or loss
    profit_or_loss = total_revenue - total_cost;

    // Display profit or loss
    if (profit_or_loss > 0) {
        printf("Vendor made a profit of $%.2f\n", profit_or_loss);
    } else if (profit_or_loss < 0) {
        printf("Vendor incurred a loss of $%.2f\n", -profit_or_loss);
    } else {
        printf("No profit, no loss for the vendor.\n");
    }

    return 0;
}
