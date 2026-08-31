from locust import HttpUser, TaskSet, task, between

# This entire stress/load test was Assisted with basic coding tools
class UserBehavior(TaskSet):
    def on_start(self):
        # When a new user is created, login to the test account.
        self.login()

    def login(self):
        response = self.client.post("/api/auth/login/", json={
            "username": "Test",
            "password": "Test123123"  
        })
        if response.status_code == 204:
            print("Login successfully!")
        else:
            print("Failed to login!", response.status_code)

    @task
    def main(self):
        self.client.get("/") # Test the front-page, by sending GET-request.

    @task
    def toplist(self):
        self.client.get("/toplist/") # Test the toplist-page, by sending GET-request.
    
    @task
    def profile(self):
        self.client.get("/profile/Test") # Test a profile-page, by sending GET-request.

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 3)  # Users wait between 1-3 seconds before sending request
