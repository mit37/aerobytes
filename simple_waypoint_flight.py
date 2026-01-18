#!/usr/bin/env python3
"""
Simple AirSimNH Waypoint Flight Script
Based on your example - flies through multiple waypoints efficiently
"""

import airsim
import time

# Connect to AirSim
client = airsim.MultirotorClient()
client.confirmConnection()
client.enableApiControl(True)  # Switches from manual/controller
client.armDisarm(True)
client.takeoffAsync().join()

# Climb to higher altitude first
print("Climbing to higher altitude...")
client.moveToZAsync(-20, 5).join()  # Go up to 20 meters (negative Z = up in NED)
print("Reached altitude, starting waypoint navigation...")

# Waypoints: [x, y, z] in UE coords (NED: North-East-Down, negative Z = up)
waypoints = [
    [-25, 25, -10],  # LOC1: Pickup
    [10, 10, -15],   # LOC2: Mid-route
    [40, -20, -10]   # LOC3: Delivery
]

print("Starting waypoint navigation...")
# Convert waypoints to Vector3r format
path = [airsim.Vector3r(wp[0], wp[1], wp[2]) for wp in waypoints]

client.moveOnPathAsync(
    path, 
    velocity=4,  # m/s
    timeout_sec=2e3,
    drivetrain=airsim.DrivetrainType.MaxDegreeOfFreedom,
    yaw_mode=airsim.YawMode(False, 0)  # Face forward (False = absolute angle, 0 = north)
).join()

print("Reached destination. Hovering for 3 seconds...")
time.sleep(3)  # Dropoff pause

print("Landing...")
client.landAsync().join()
client.enableApiControl(False)  # Back to controller
print("Flight complete!")

