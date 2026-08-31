#Initial code

# t = int(input())

# for _ in range(t):
#     n = input()
#     opponentRun = int(n.split(" ")[0])
#     batsmanRun = int(n.split(" ")[1])
#     remainingBall = int(n.split(" ")[2])

#     completedOver = (300 - remainingBall) / 6
#     currentRunRate = batsmanRun / completedOver
#     RequiredRunRate = ((opponentRun + 1) - batsmanRun) / (remainingBall / 6)

#     print(f"{currentRunRate:.2f} {RequiredRunRate:.2f}")








# Modified using chatgpt and other resources

# t = int(input())

# for _ in range(t):
#     n = input()
#     opponentRun = int(n.split(" ")[0])
#     batsmanRun = int(n.split(" ")[1])
#     remainingBall = int(n.split(" ")[2])

#     if remainingBall == 0:
#         currentRunRate = batsmanRun / 50  # পুরো ৫০ ওভার খেলা হয়েছে
#     else:
#         completedOver = (300 - remainingBall) / 6
#         currentRunRate = batsmanRun / completedOver

#     if remainingBall == 0:
#         requiredRunRate = 0  # বাকি বল নেই, কোনো রান দরকার নেই
#     else:
#         runs_needed = (opponentRun + 1) - batsmanRun
#         overs_remaining = remainingBall / 6
#         requiredRunRate = runs_needed / overs_remaining

#     print(f"{currentRunRate:.2f} {requiredRunRate:.2f}")







#Aided using common development resources

# Number of test cases


# T = int(input())

# while T > 0:
#     # Read inputs
#     r1, r2, B = map(int, input().split())
    
#     # Calculate balls played
#     ball_played = 300 - B

#     # Calculate current run rate and asking run rate
#     current_rr = (r2 / ball_played) * 6
#     asking_rr = ((r1 - r2 + 1) / B) * 6

#     # Print results with two decimal places
#     print(f"{current_rr:.2f} {asking_rr:.2f}")
    
#     T -= 1









#Accepted Code

# t = int(input())

# for _ in range(t):
#     r1, r2, B = map(int, input().split())

#     if B == 0:
#         currentRunRate = r2 / 50
#     else:
#         completedOver = (300 - B) / 6
#         currentRunRate = r2 / completedOver

#     if B == 0 or r2 > r1:
#         requiredRunRate = 0.00
#     else:
#         runs_needed = (r1 + 1) - r2
#         overs_remaining = B / 6
#         requiredRunRate = runs_needed / overs_remaining

#     print(f"{currentRunRate:.2f} {requiredRunRate:.2f}")
















#Aided using common development resources

# Number of test cases


# T = int(input())

# while T > 0:
#     # Read inputs
#     r1, r2, B = map(int, input().split())
    
#     # Calculate balls played
#     ball_played = 300 - B

#     # Calculate current run rate and asking run rate
#     current_rr = (r2 / ball_played) * 6
#     asking_rr = ((r1 - r2 + 1) / B) * 6

#     # Print results with two decimal places
#     print(f"{current_rr:.2f} {asking_rr:.2f}")
    
#     T -= 1





