This project is to automate the whole dormant user process for thingstream, for internal use. 

# Node.js Script for Data Processing

This script processes device and tenant data files, generating a `master.xlsx` file in the `output` folder. The input files are then moved to the `executed` folder to prevent re-processing in the future.

## Prerequisites

- **Node.js**: Make sure you have the latest version of Node.js installed. You can download it from [Node.js official website](https://nodejs.org/).

## Setup Instructions

Follow these steps to set up and run the script:

1. **Clone the Repository**

   Clone the repository using the following command:
   ```bash
   git clone <repository-url>
2. **Pull the Latest Code from the Main Branch**
    ```bash
    git pull origin main
3. **Delete .gitkeep Files**

    Delete any .gitkeep files inside the input/devices and input/tenants folders:
    ```bash
    rm input/devices/.gitkeep
    rm input/tenants/.gitkeep
4. **Install Dependencies**

    Install the required Node.js packages:

    ```bash
    Copy code
    npm install
5. **Place Input Files**

    Place the devices file in the input/devices folder.

    Place the tenants file in the input/tenants folder.
6. **Run the Script**

    Install the required Node.js packages:
    ```bash
    node index.js
7. **Check the Output**

    After running the script:

    The `master.xlsx` file will be generated in the output folder.
    Your input files will be moved to the executed folder to avoid re-processing them in the future.