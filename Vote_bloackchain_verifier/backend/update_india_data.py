import json
import urllib.request
import os

# Create realistic Tamil Nadu data with all 38 districts
tn_districts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
    "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
    "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
    "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
    "Viluppuram", "Virudhunagar"
]

ts_content = """export interface PollingStation {
  number: number;
  name: string;
  location: string;
}

export interface Constituency {
  name: string;
  pollingStations: PollingStation[];
}

export interface District {
  name: string;
  constituencies: Constituency[];
}

export interface State {
  name: string;
  districts: District[];
}

export const states: State[] = [
"""

# Let's create the Tamil Nadu state object
tn_state = '  {\n    name: "Tamil Nadu",\n    districts: [\n'

for dist in tn_districts:
    tn_state += f'      {{\n        name: "{dist}",\n        constituencies: [\n'
    # Generate a couple of mock constituencies for each district
    for c_i, c_name in enumerate([f"{dist} North", f"{dist} South"]):
        tn_state += f'          {{\n            name: "{c_name}",\n            pollingStations: [\n'
        tn_state += f'              {{ number: 101, name: "Govt. Higher Secondary School, {dist}", location: "Main Road, {dist}" }},\n'
        tn_state += f'              {{ number: 102, name: "Panchayat Union School, {dist}", location: "Market Street, {dist}" }},\n'
        tn_state += f'              {{ number: 103, name: "Community Hall, {dist}", location: "Station Road, {dist}" }},\n'
        tn_state += '            ]\n          },\n'
    tn_state += '        ]\n      },\n'
tn_state += '    ]\n  }\n'

ts_content += tn_state + "];\n"

# Output file path relative to this script
frontend_file = os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data", "indiaData.ts")

# Write to typescript file
with open(frontend_file, "w") as f:
    f.write(ts_content)

print("Successfully generated all 38 Tamil Nadu districts mapping into frontend/src/data/indiaData.ts")
