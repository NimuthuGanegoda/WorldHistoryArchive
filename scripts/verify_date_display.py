
import time
import os
import subprocess
import re
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright, expect

def verify_date_display():
    # Ensure out directory exists
    if not os.path.exists("out"):
        print("Error: 'out' directory not found. Run 'npm run build' first.")
        exit(1)

    # Start the server (serving 'out' directory)
    print("Starting server...")
    server = subprocess.Popen(["python3", "-m", "http.server", "8000", "--directory", "out"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(2) # Wait for server to start

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            try:
                print("Navigating to homepage...")
                page.goto("http://localhost:8000/")

                # Scroll down to Featured Rulers to trigger animation
                print("Scrolling to Featured Rulers...")
                featured_heading = page.get_by_role("heading", name="Featured Rulers")
                featured_heading.scroll_into_view_if_needed()
                time.sleep(1) # Wait for animation

                # Verify date is visible
                # Calculate expected date string
                now_utc = datetime.now(timezone.utc)
                # Format: Sunday, February 15, 2026
                # The code uses: .toLocaleDateString('en-US', { day: 'numeric' }) which gives unpadded.

                day = now_utc.day
                expected_date_part = f"{now_utc.strftime('%B')} {day}, {now_utc.year}"
                print(f"Looking for date containing: {expected_date_part}")

                # Locate the date element
                # It is a div with class ... text-sm ... uppercase
                # It should contain the expected date part.

                # We can use a text locator
                date_element = page.get_by_text(re.compile(expected_date_part))

                if date_element.count() > 0:
                    print(f"PASS: Found date element matching '{expected_date_part}'")
                    date_element.first.scroll_into_view_if_needed()
                    page.screenshot(path="verification_featured_kings.png")
                    print("Screenshot saved to verification_featured_kings.png")
                else:
                    print(f"FAIL: Date element matching '{expected_date_part}' not found.")
                    print("Page text content around Featured Rulers:")
                    # snapshot content
                    print(page.locator("section").filter(has_text="Featured Rulers").text_content())
                    exit(1)

            except Exception as e:
                print(f"Error during verification: {e}")
                exit(1)
            finally:
                browser.close()
    finally:
        server.terminate()
        print("Server terminated.")

if __name__ == "__main__":
    verify_date_display()
