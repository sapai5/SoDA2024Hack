import re
import json
from selenium import webdriver
from selenium.webdriver import ChromeOptions
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time

# Set up Selenium WebDriver (make sure the path to your chromedriver is correct)
options = ChromeOptions()
driver = webdriver.Chrome(options=options)  # Replace with your chromedriver path

# The URL for the ASU class catalog page
url = 'https://catalog.apps.asu.edu/catalog/classes/classlist?campusOrOnlineSelection=C&honors=F&level=undergrad&promod=F&searchType=all&term=2251'

# Open the URL
driver.get(url)

# Function to extract course tags (like WPC 480) using a regular expression to ensure proper format
def extract_courses_from_page(page_source, unique_courses):
    soup = BeautifulSoup(page_source, 'html.parser')

    # Find all course tags (e.g., "WPC 480") within <span> tags with class 'bold-hyperlink'
    course_tags = soup.find_all('span', class_='bold-hyperlink')

    # Regular expression to match valid course codes (e.g., "ABC 123")
    course_code_pattern = re.compile(r'^[A-Z]{3} \d{3}$')

    # Collect and store only valid course codes
    for course in course_tags:
        course_text = course.text.strip()
        if course_code_pattern.match(course_text):  # Only add valid course codes
            if course_text not in unique_courses:
                unique_courses.add(course_text)  # Add to the set for uniqueness

    return unique_courses

# Store all unique course tags
unique_courses = set()  # Use a set to ensure no duplicates

# Extract course tags from the first page
unique_courses = extract_courses_from_page(driver.page_source, unique_courses)
time.sleep(60)

# Navigate through pages
while True:
    try:
        # Scroll down to make sure the "Next" button is visible
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(5)  # Adjust wait time if necessary

        # Find the 'Next' button using a combination of class name and aria-label
        next_button = driver.find_element(By.XPATH, '//a[@aria-label="Next page" and contains(@class, "page-link")]')

        # Check if the 'Next' button is disabled by checking the aria-disabled attribute
        if next_button.get_attribute('aria-disabled') == 'true':
            break  # Exit if the 'Next' button is disabled

        # Click the 'Next' button using JavaScript (sometimes it's more reliable)
        driver.execute_script("arguments[0].click();", next_button)

        # Wait for the page to load (adjust the time if necessary)
        time.sleep(5)

        # Extract course tags from the next page
        unique_courses = extract_courses_from_page(driver.page_source, unique_courses)

        # Print the list of unique course tags after each page
        print("Current list of course tags after this page:")
        for course in sorted(unique_courses):  # Sorted for better readability
            print(f"Course: {course}")

    except Exception as e:
        print("No more pages or an error occurred:", e)
        break

# Close the Selenium browser
driver.quit()

# Convert the set of unique courses to a sorted list for saving to JSON
course_list = sorted(unique_courses)

# Write the unique course list to a JSON file
with open('scrape.json', 'w') as f:
    json.dump(course_list, f, indent=4)

# Print the final list of unique scraped course tags
print("Final list of unique course tags saved to scrape.json:")
if unique_courses:
    for course in course_list:  # Sorted for better readability
        print(f"Course: {course}")
else:
    print("No courses were scraped.")
