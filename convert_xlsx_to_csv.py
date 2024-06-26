import os
import shutil
import pandas as pd

# Sheet names to convert in KPI files
sheet_names_to_convert = ['English KPIs', 'Squash KPIs']

# Function to convert specified sheets of an Excel file to CSV
def convert_specified_sheets_to_csv(file_path, folder_name, year):
    # Load the Excel file
    xls = pd.ExcelFile(file_path)
    
    # Loop through the specified sheet names and save each as a CSV if it exists in the workbook
    for sheet_name in sheet_names_to_convert:
        if sheet_name in xls.sheet_names:
            # Load the specific sheet without treating any row as the header
            df = pd.read_excel(xls, sheet_name=sheet_name, header=None)
            
            # Define the output CSV file path without spaces in the filename
            csv_file_name = f'{folder_name}_{year}_{sheet_name}.csv'.replace(" ", "_")
            csv_file_path = os.path.join(output_dir, csv_file_name)
            
            # Save the dataframe as a CSV file without a header
            df.to_csv(csv_file_path, index=False, header=False)
            
            print(f'Successfully converted {sheet_name} to {csv_file_path}')
        else:
            print(f'Sheet {sheet_name} not found in {file_path}')

# Function to determine the output file name based on the first cell's content
def determine_ndo_filename(df):
    first_cell = df.iloc[0, 0]  # Read the first cell content
    if isinstance(first_cell, str) and "Attendance Report from" in first_cell:
        dates = first_cell.split(" from ")[1].split(" to ")
        start_year = dates[0][:4]
        end_year = dates[1][:4]
        if start_year == end_year:
            return [f'Nicol_David_Organisation_{start_year}.csv']
        else:
            return [f'Nicol_David_Organisation_{start_year}.csv', f'Nicol_David_Organisation_{end_year}.csv']
    else:
        return None

# Function to convert one sheet of an Excel file to CSV
def convert_single_sheet_to_csv(file_path, output_name, output_dir):
    # Load the single sheet Excel file
    df = pd.read_excel(file_path, header=None)
    
    # Determine the output CSV file name(s) based on the content of the first cell
    new_output_names = determine_ndo_filename(df)
    if new_output_names:
        for new_output_name in new_output_names:
            # Define the output CSV file path without spaces in the filename
            csv_file_path = os.path.join(output_dir, new_output_name.replace(" ", "_"))
            
            # Save the dataframe as a CSV file without a header
            df.to_csv(csv_file_path, index=False, header=False)
            
            print(f'Successfully converted {file_path} to {csv_file_path}')
    else:
        # Define the output CSV file path without spaces in the filename
        csv_file_path = os.path.join(output_dir, output_name.replace(" ", "_"))
        
        # Save the dataframe as a CSV file without a header
        df.to_csv(csv_file_path, index=False, header=False)
        
        print(f'Successfully converted {file_path} to {csv_file_path}')

# Base directory containing the datasets
base_dir = 'datasets'
output_dir = 'datasets_csv'  # Define where you want to save the CSV files

# Clean the output directory if it exists, or create it if it doesn't
if os.path.exists(output_dir):
    shutil.rmtree(output_dir)
os.makedirs(output_dir)

# Walk through the directory structure
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.xlsx'):
            # Construct the full path to the Excel file
            excel_file_path = os.path.join(root, file)
            
            # Determine the folder name (e.g., 'KPI (C1)') and file name (e.g., '(2022) KPI.xlsx')
            folder_name = os.path.basename(root)
            file_name = os.path.splitext(file)[0]
            year = file.split(')')[0].strip('(') if '(' in file else 'Unknown'
            
            # Determine the output CSV file name based on the conditions
            if file_name.startswith('Nicol_David_Organisation'):
                # Convert the Excel file to CSV
                convert_single_sheet_to_csv(excel_file_path, csv_file_name, output_dir)
            elif file_name.startswith('Database NDO'):
                csv_file_name = 'Database_NDO.csv'
                convert_single_sheet_to_csv(excel_file_path, csv_file_name, output_dir)
            else:
                # Convert the specified sheets of the Excel file to CSV
                convert_specified_sheets_to_csv(excel_file_path, folder_name, year)
