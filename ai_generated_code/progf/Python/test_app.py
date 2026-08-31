"""
Test suite for Task Manager API - Demonstrates AI-assisted test generation

These tests were largely Supported via standard GitHub programming aids with specific prompts like:
"Generate comprehensive tests for the complete_task endpoint including edge cases"
"""

import pytest
import json
from datetime import datetime
from app import app, tasks, next_task_id


@pytest.fixture
def client():
    """Create a test client for the Flask app"""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def sample_task(client):
    """Create a sample task for testing"""
    # Clear existing tasks for clean test state
    tasks.clear()
    global next_task_id
    next_task_id = 1

    response = client.post(
        "/tasks",
        data=json.dumps({"title": "Test Task", "description": "A task for testing"}),
        content_type="application/json",
    )

    return json.loads(response.data)


class TestCompleteTaskEndpoint:
    """
    Test suite for the new complete-task endpoint
    Copilot helped generate these comprehensive test cases
    """

    def test_complete_existing_task_success(self, client, sample_task):
        """Test successfully completing an existing task"""
        task_id = sample_task["id"]

        response = client.post(f"/complete-task/{task_id}")

        assert response.status_code == 200
        data = json.loads(response.data)

        # Verify response structure
        assert "message" in data
        assert "task" in data
        assert data["message"] == "Task completed successfully"

        # Verify task was updated correctly
        task = data["task"]
        assert task["completed"] == True
        assert task["completed_at"] is not None
        assert task["id"] == task_id

        # Verify timestamp format (Copilot suggested this validation)
        datetime.fromisoformat(task["completed_at"].replace("Z", "+00:00"))

    def test_complete_nonexistent_task(self, client):
        """Test completing a task that doesn't exist"""
        response = client.post("/complete-task/999")

        assert response.status_code == 404
        data = json.loads(response.data)

        assert "error" in data
        assert data["error"] == "Task not found"
        assert data["task_id"] == 999

    def test_complete_already_completed_task(self, client, sample_task):
        """Test completing a task that's already completed"""
        task_id = sample_task["id"]

        # Complete the task first
        client.post(f"/complete-task/{task_id}")

        # Try to complete it again
        response = client.post(f"/complete-task/{task_id}")

        assert response.status_code == 200
        data = json.loads(response.data)

        assert data["message"] == "Task already completed"
        assert data["task"]["completed"] == True

    def test_complete_task_invalid_id_type(self, client):
        """Test with invalid task ID type (string instead of int)"""
        response = client.post("/complete-task/invalid")

        # Flask should return 404 for invalid route parameter
        assert response.status_code == 404

    def test_complete_task_negative_id(self, client):
        """Test with negative task ID"""
        response = client.post("/complete-task/-1")

        assert response.status_code == 404
        data = json.loads(response.data)
        assert "error" in data


class TestTaskManagementIntegration:
    """Integration tests for the complete task feature with other endpoints"""

    def test_complete_task_then_retrieve(self, client, sample_task):
        """Test that completed task shows up correctly in GET requests"""
        task_id = sample_task["id"]

        # Complete the task
        client.post(f"/complete-task/{task_id}")

        # Retrieve the specific task
        response = client.get(f"/tasks/{task_id}")
        assert response.status_code == 200

        task = json.loads(response.data)
        assert task["completed"] == True
        assert task["completed_at"] is not None

    def test_complete_task_in_task_list(self, client, sample_task):
        """Test that completed task appears correctly in the task list"""
        task_id = sample_task["id"]

        # Complete the task
        client.post(f"/complete-task/{task_id}")

        # Get all tasks
        response = client.get("/tasks")
        assert response.status_code == 200

        data = json.loads(response.data)
        completed_tasks = [t for t in data["tasks"] if t["completed"]]

        assert len(completed_tasks) == 1
        assert completed_tasks[0]["id"] == task_id


class TestErrorHandling:
    """Test error handling scenarios - Copilot suggested these edge cases"""

    def test_complete_task_with_zero_id(self, client):
        """Test with task ID of 0"""
        response = client.post("/complete-task/0")
        assert response.status_code == 404

    def test_complete_task_method_not_allowed(self, client):
        """Test that only POST method is allowed"""
        response = client.get("/complete-task/1")
        assert response.status_code == 405  # Method Not Allowed


def test_task_creation_still_works(client):
    """Ensure that adding the new endpoint didn't break existing functionality"""
    task_data = {
        "title": "Integration Test Task",
        "description": "Testing that old functionality still works",
    }

    response = client.post(
        "/tasks", data=json.dumps(task_data), content_type="application/json"
    )

    assert response.status_code == 201
    data = json.loads(response.data)

    assert data["title"] == task_data["title"]
    assert data["completed"] == False
    assert data["completed_at"] is None


if __name__ == "__main__":
    # Run tests with verbose output
    pytest.main(["-v", __file__])
