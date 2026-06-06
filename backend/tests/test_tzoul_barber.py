"""Backend tests for TZOUL BARBER API"""
import pytest
import requests
import os

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")

class TestPublicAPIs:
    """Public API endpoint tests"""

    def test_root(self):
        r = requests.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("name") == "TZOUL BARBER API"
        assert data.get("status") == "ok"
        print("PASS: root endpoint")

    def test_services_count(self):
        r = requests.get(f"{BASE_URL}/api/services")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 11
        print(f"PASS: services count = {len(data)}")

    def test_services_fields(self):
        r = requests.get(f"{BASE_URL}/api/services")
        data = r.json()
        for svc in data:
            assert "id" in svc
            assert "name" in svc
            assert "price" in svc
            assert "duration" in svc
        print("PASS: services fields present")

    def test_barbers(self):
        r = requests.get(f"{BASE_URL}/api/barbers")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 1
        assert data[0]["name"] == "PAVLOS"
        print("PASS: barbers - 1 barber PAVLOS")

    def test_business(self):
        r = requests.get(f"{BASE_URL}/api/business")
        assert r.status_code == 200
        data = r.json()
        assert data.get("name") == "TZOUL BARBER"
        assert "address" in data
        assert "phone" in data
        print("PASS: business info")

    def test_testimonials(self):
        r = requests.get(f"{BASE_URL}/api/testimonials")
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        print(f"PASS: testimonials count = {len(data)}")

    def test_availability(self):
        r = requests.get(f"{BASE_URL}/api/availability?date=2026-06-10&barber_id=pavlos")
        assert r.status_code == 200
        data = r.json()
        assert "date" in data
        assert "slots" in data
        print(f"PASS: availability slots = {len(data['slots'])}")


class TestAdminAuth:
    """Admin authentication tests"""

    def test_admin_login_success(self):
        r = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": "admin@tzoulbarber.com",
            "password": "admin123"
        })
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data
        assert len(data["access_token"]) > 0
        print("PASS: admin login successful")

    def test_admin_login_wrong_password(self):
        r = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": "admin@tzoulbarber.com",
            "password": "wrongpassword"
        })
        assert r.status_code == 401
        print("PASS: admin login rejects wrong password")

    def test_admin_bookings_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/admin/bookings")
        assert r.status_code in [401, 403]
        print("PASS: admin bookings protected")

    def test_admin_bookings_with_token(self):
        # Login first
        login = requests.post(f"{BASE_URL}/api/admin/login", json={
            "email": "admin@tzoulbarber.com",
            "password": "admin123"
        })
        token = login.json().get("access_token")
        r = requests.get(f"{BASE_URL}/api/admin/bookings",
                         headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 200
        print("PASS: admin bookings accessible with token")


class TestBookingFlow:
    """Booking creation and validation tests"""

    def test_create_booking(self):
        r = requests.post(f"{BASE_URL}/api/bookings", json={
            "service_id": "haircut",
            "barber_id": "pavlos",
            "date": "2026-09-15",
            "time": "11:00",
            "name": "TEST_User",
            "phone": "+30000000001",
            "email": "test@example.com"
        })
        assert r.status_code == 200
        data = r.json()
        assert data["service_name"] == "Haircut"
        assert data["barber_name"] == "PAVLOS"
        assert data["status"] == "confirmed"
        assert "id" in data
        print(f"PASS: booking created id={data['id'][:8]}")

    def test_create_booking_invalid_service(self):
        r = requests.post(f"{BASE_URL}/api/bookings", json={
            "service_id": "nonexistent",
            "barber_id": "pavlos",
            "date": "2026-09-16",
            "time": "11:00",
            "name": "TEST_User",
            "phone": "+30000000001"
        })
        assert r.status_code == 404
        print("PASS: invalid service returns 404")
