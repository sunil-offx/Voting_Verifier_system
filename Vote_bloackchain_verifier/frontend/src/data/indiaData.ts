export interface PollingStation {
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
  {
    name: "Andhra Pradesh",
    districts: [
      {
        name: "Visakhapatnam",
        constituencies: [
          {
            name: "Visakhapatnam East",
            pollingStations: [
              { number: 101, name: "Govt. High School, Dwaraka Nagar", location: "Dwaraka Nagar, Visakhapatnam" },
              { number: 102, name: "ZP High School, Akkayyapalem", location: "Akkayyapalem, Visakhapatnam" },
              { number: 103, name: "Municipal School, Jagadamba Centre", location: "Jagadamba Junction, Visakhapatnam" },
              { number: 104, name: "Community Hall, Siripuram", location: "Siripuram, Visakhapatnam" },
            ],
          },
          {
            name: "Visakhapatnam West",
            pollingStations: [
              { number: 101, name: "Govt. School, MVP Colony", location: "MVP Colony, Visakhapatnam" },
              { number: 102, name: "Primary School, Seethammadhara", location: "Seethammadhara, Visakhapatnam" },
              { number: 103, name: "Community Hall, Rushikonda", location: "Rushikonda, Visakhapatnam" },
            ],
          },
        ],
      },
      {
        name: "Guntur",
        constituencies: [
          {
            name: "Guntur West",
            pollingStations: [
              { number: 101, name: "Govt. High School, Brodipet", location: "Brodipet, Guntur" },
              { number: 102, name: "Municipal School, Arundelpet", location: "Arundelpet, Guntur" },
              { number: 103, name: "ZP School, Lakshmipuram", location: "Lakshmipuram, Guntur" },
            ],
          },
        ],
      },
      {
        name: "Krishna",
        constituencies: [
          {
            name: "Vijayawada Central",
            pollingStations: [
              { number: 101, name: "Govt. School, Governorpet", location: "Governorpet, Vijayawada" },
              { number: 102, name: "Municipal School, Benz Circle", location: "Benz Circle, Vijayawada" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Arunachal Pradesh",
    districts: [
      {
        name: "Itanagar Capital Complex",
        constituencies: [
          {
            name: "Itanagar",
            pollingStations: [
              { number: 101, name: "Govt. School, Itanagar", location: "Itanagar" },
              { number: 102, name: "Community Hall, Naharlagun", location: "Naharlagun" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Assam",
    districts: [
      {
        name: "Kamrup Metropolitan",
        constituencies: [
          {
            name: "Dispur",
            pollingStations: [
              { number: 101, name: "Govt. School, Dispur", location: "Dispur, Guwahati" },
              { number: 102, name: "Community Hall, Ganeshguri", location: "Ganeshguri, Guwahati" },
              { number: 103, name: "Primary School, Beltola", location: "Beltola, Guwahati" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Bihar",
    districts: [
      {
        name: "Patna",
        constituencies: [
          {
            name: "Patna Sahib",
            pollingStations: [
              { number: 101, name: "Govt. School, Bankipore", location: "Bankipore, Patna" },
              { number: 102, name: "Community Hall, Kankarbagh", location: "Kankarbagh, Patna" },
              { number: 103, name: "Primary School, Rajendra Nagar", location: "Rajendra Nagar, Patna" },
              { number: 104, name: "Panchayat Bhawan, Danapur", location: "Danapur, Patna" },
            ],
          },
          {
            name: "Kumhrar",
            pollingStations: [
              { number: 101, name: "Govt. Middle School, Kumhrar", location: "Kumhrar, Patna" },
              { number: 102, name: "Primary School, Anisabad", location: "Anisabad, Patna" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Chhattisgarh",
    districts: [
      {
        name: "Raipur",
        constituencies: [
          {
            name: "Raipur City",
            pollingStations: [
              { number: 101, name: "Govt. School, Shankar Nagar", location: "Shankar Nagar, Raipur" },
              { number: 102, name: "Community Hall, Telibandha", location: "Telibandha, Raipur" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Delhi",
    districts: [
      {
        name: "New Delhi",
        constituencies: [
          {
            name: "New Delhi Assembly",
            pollingStations: [
              { number: 101, name: "Kendriya Vidyalaya, Gole Market", location: "Gole Market, New Delhi" },
              { number: 102, name: "Govt. School, Connaught Place", location: "Connaught Place, New Delhi" },
              { number: 103, name: "Community Centre, Mandi House", location: "Mandi House, New Delhi" },
              { number: 104, name: "Primary School, Barakhamba", location: "Barakhamba Road, New Delhi" },
              { number: 105, name: "Municipal School, Janpath", location: "Janpath, New Delhi" },
            ],
          },
        ],
      },
      {
        name: "South Delhi",
        constituencies: [
          {
            name: "Mehrauli",
            pollingStations: [
              { number: 101, name: "Govt. School, Mehrauli", location: "Mehrauli, South Delhi" },
              { number: 102, name: "Community Hall, Chattarpur", location: "Chattarpur, South Delhi" },
              { number: 103, name: "Primary School, Qutub Minar Area", location: "Qutub Minar, South Delhi" },
            ],
          },
          {
            name: "Chhatarpur",
            pollingStations: [
              { number: 101, name: "Govt. School, Chhatarpur Enclave", location: "Chhatarpur Enclave, South Delhi" },
              { number: 102, name: "Community Centre, Satbari", location: "Satbari, South Delhi" },
            ],
          },
        ],
      },
      {
        name: "East Delhi",
        constituencies: [
          {
            name: "Laxmi Nagar",
            pollingStations: [
              { number: 101, name: "Govt. School, Laxmi Nagar", location: "Laxmi Nagar, East Delhi" },
              { number: 102, name: "Community Hall, Preet Vihar", location: "Preet Vihar, East Delhi" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Goa",
    districts: [
      {
        name: "North Goa",
        constituencies: [
          {
            name: "Panaji",
            pollingStations: [
              { number: 101, name: "Govt. School, Panaji", location: "Panaji, North Goa" },
              { number: 102, name: "Community Hall, Altinho", location: "Altinho, Panaji" },
            ],
          },
        ],
      },
      {
        name: "South Goa",
        constituencies: [
          {
            name: "Margao",
            pollingStations: [
              { number: 101, name: "Govt. School, Margao", location: "Margao, South Goa" },
              { number: 102, name: "Community Hall, Fatorda", location: "Fatorda, South Goa" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Gujarat",
    districts: [
      {
        name: "Ahmedabad",
        constituencies: [
          {
            name: "Ellisbridge",
            pollingStations: [
              { number: 101, name: "Municipal School, CG Road", location: "CG Road, Ahmedabad" },
              { number: 102, name: "Govt. School, Navrangpura", location: "Navrangpura, Ahmedabad" },
              { number: 103, name: "Community Hall, Paldi", location: "Paldi, Ahmedabad" },
            ],
          },
        ],
      },
      {
        name: "Surat",
        constituencies: [
          {
            name: "Surat City",
            pollingStations: [
              { number: 101, name: "Govt. School, Athwa", location: "Athwa, Surat" },
              { number: 102, name: "Community Hall, Adajan", location: "Adajan, Surat" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Haryana",
    districts: [
      {
        name: "Gurugram",
        constituencies: [
          {
            name: "Gurugram",
            pollingStations: [
              { number: 101, name: "Govt. School, Sector 14", location: "Sector 14, Gurugram" },
              { number: 102, name: "Community Hall, DLF Phase 1", location: "DLF Phase 1, Gurugram" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Himachal Pradesh",
    districts: [
      {
        name: "Shimla",
        constituencies: [
          {
            name: "Shimla Urban",
            pollingStations: [
              { number: 101, name: "Govt. School, The Mall", location: "The Mall, Shimla" },
              { number: 102, name: "Community Hall, Lakkar Bazaar", location: "Lakkar Bazaar, Shimla" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Jharkhand",
    districts: [
      {
        name: "Ranchi",
        constituencies: [
          {
            name: "Ranchi",
            pollingStations: [
              { number: 101, name: "Govt. School, Main Road", location: "Main Road, Ranchi" },
              { number: 102, name: "Community Hall, Doranda", location: "Doranda, Ranchi" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Karnataka",
    districts: [
      {
        name: "Bengaluru Urban",
        constituencies: [
          {
            name: "Jayanagar",
            pollingStations: [
              { number: 101, name: "Govt. School, 4th Block Jayanagar", location: "4th Block, Jayanagar, Bengaluru" },
              { number: 102, name: "Primary School, JP Nagar", location: "JP Nagar, Bengaluru" },
              { number: 103, name: "Community Hall, BTM Layout", location: "BTM Layout, Bengaluru" },
              { number: 104, name: "Municipal School, Banashankari", location: "Banashankari, Bengaluru" },
            ],
          },
          {
            name: "Shivajinagar",
            pollingStations: [
              { number: 101, name: "Govt. High School, Shivajinagar", location: "Shivajinagar, Bengaluru" },
              { number: 102, name: "Community Centre, Commercial Street", location: "Commercial Street, Bengaluru" },
            ],
          },
        ],
      },
      {
        name: "Mysuru",
        constituencies: [
          {
            name: "Mysuru City",
            pollingStations: [
              { number: 101, name: "Govt. School, Saraswathipuram", location: "Saraswathipuram, Mysuru" },
              { number: 102, name: "Community Hall, Vijayanagar", location: "Vijayanagar, Mysuru" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Kerala",
    districts: [
      {
        name: "Thiruvananthapuram",
        constituencies: [
          {
            name: "Kovalam",
            pollingStations: [
              { number: 101, name: "Govt. School, Kovalam", location: "Kovalam, Thiruvananthapuram" },
              { number: 102, name: "Panchayat Hall, Vizhinjam", location: "Vizhinjam, Thiruvananthapuram" },
              { number: 103, name: "Primary School, Balaramapuram", location: "Balaramapuram, Thiruvananthapuram" },
            ],
          },
        ],
      },
      {
        name: "Ernakulam",
        constituencies: [
          {
            name: "Kochi",
            pollingStations: [
              { number: 101, name: "Govt. School, Fort Kochi", location: "Fort Kochi, Ernakulam" },
              { number: 102, name: "Community Hall, MG Road", location: "MG Road, Ernakulam" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Madhya Pradesh",
    districts: [
      {
        name: "Bhopal",
        constituencies: [
          {
            name: "Bhopal North",
            pollingStations: [
              { number: 101, name: "Govt. School, Shahpura", location: "Shahpura, Bhopal" },
              { number: 102, name: "Community Hall, Kolar", location: "Kolar, Bhopal" },
              { number: 103, name: "Municipal School, Habibganj", location: "Habibganj, Bhopal" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Maharashtra",
    districts: [
      {
        name: "Mumbai City",
        constituencies: [
          {
            name: "Colaba",
            pollingStations: [
              { number: 101, name: "Municipal School, Colaba", location: "Colaba, Mumbai" },
              { number: 102, name: "Govt. School, Cuffe Parade", location: "Cuffe Parade, Mumbai" },
              { number: 103, name: "Community Hall, Fort", location: "Fort, Mumbai" },
            ],
          },
          {
            name: "Malabar Hill",
            pollingStations: [
              { number: 101, name: "Govt. School, Malabar Hill", location: "Malabar Hill, Mumbai" },
              { number: 102, name: "Community Centre, Walkeshwar", location: "Walkeshwar, Mumbai" },
              { number: 103, name: "Primary School, Grant Road", location: "Grant Road, Mumbai" },
            ],
          },
        ],
      },
      {
        name: "Pune",
        constituencies: [
          {
            name: "Shivajinagar (Pune)",
            pollingStations: [
              { number: 101, name: "Govt. School, Deccan", location: "Deccan Gymkhana, Pune" },
              { number: 102, name: "Municipal School, FC Road", location: "Fergusson College Road, Pune" },
              { number: 103, name: "Community Hall, JM Road", location: "JM Road, Pune" },
              { number: 104, name: "Primary School, Model Colony", location: "Model Colony, Pune" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Manipur",
    districts: [
      {
        name: "Imphal West",
        constituencies: [
          {
            name: "Imphal",
            pollingStations: [
              { number: 101, name: "Govt. School, Imphal", location: "Imphal, Manipur" },
              { number: 102, name: "Community Hall, Lamphel", location: "Lamphel, Imphal" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Meghalaya",
    districts: [
      {
        name: "East Khasi Hills",
        constituencies: [
          {
            name: "Shillong",
            pollingStations: [
              { number: 101, name: "Govt. School, Police Bazaar", location: "Police Bazaar, Shillong" },
              { number: 102, name: "Community Hall, Laitumkhrah", location: "Laitumkhrah, Shillong" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Mizoram",
    districts: [
      {
        name: "Aizawl",
        constituencies: [
          {
            name: "Aizawl East",
            pollingStations: [
              { number: 101, name: "Govt. School, Aizawl", location: "Aizawl, Mizoram" },
              { number: 102, name: "Community Hall, Thuampui", location: "Thuampui, Aizawl" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Nagaland",
    districts: [
      {
        name: "Kohima",
        constituencies: [
          {
            name: "Kohima Town",
            pollingStations: [
              { number: 101, name: "Govt. School, Kohima", location: "Kohima, Nagaland" },
              { number: 102, name: "Community Hall, High School Area", location: "High School Area, Kohima" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Odisha",
    districts: [
      {
        name: "Khordha",
        constituencies: [
          {
            name: "Bhubaneswar Central",
            pollingStations: [
              { number: 101, name: "Govt. School, Saheed Nagar", location: "Saheed Nagar, Bhubaneswar" },
              { number: 102, name: "Community Hall, Jaydev Vihar", location: "Jaydev Vihar, Bhubaneswar" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Punjab",
    districts: [
      {
        name: "Ludhiana",
        constituencies: [
          {
            name: "Ludhiana Central",
            pollingStations: [
              { number: 101, name: "Govt. School, Civil Lines", location: "Civil Lines, Ludhiana" },
              { number: 102, name: "Community Hall, Model Town", location: "Model Town, Ludhiana" },
            ],
          },
        ],
      },
      {
        name: "Amritsar",
        constituencies: [
          {
            name: "Amritsar Central",
            pollingStations: [
              { number: 101, name: "Govt. School, Hall Bazaar", location: "Hall Bazaar, Amritsar" },
              { number: 102, name: "Community Hall, Ranjit Avenue", location: "Ranjit Avenue, Amritsar" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Rajasthan",
    districts: [
      {
        name: "Jaipur",
        constituencies: [
          {
            name: "Jaipur City",
            pollingStations: [
              { number: 101, name: "Govt. School, MI Road", location: "MI Road, Jaipur" },
              { number: 102, name: "Community Hall, C-Scheme", location: "C-Scheme, Jaipur" },
              { number: 103, name: "Primary School, Malviya Nagar", location: "Malviya Nagar, Jaipur" },
            ],
          },
        ],
      },
      {
        name: "Jodhpur",
        constituencies: [
          {
            name: "Jodhpur City",
            pollingStations: [
              { number: 101, name: "Govt. School, Sardarpura", location: "Sardarpura, Jodhpur" },
              { number: 102, name: "Community Hall, Paota", location: "Paota, Jodhpur" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Sikkim",
    districts: [
      {
        name: "East Sikkim",
        constituencies: [
          {
            name: "Gangtok",
            pollingStations: [
              { number: 101, name: "Govt. School, MG Marg", location: "MG Marg, Gangtok" },
              { number: 102, name: "Community Hall, Deorali", location: "Deorali, Gangtok" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Tamil Nadu",
    districts: [
      {
        name: "Chennai",
        constituencies: [
          {
            name: "Mylapore",
            pollingStations: [
              { number: 101, name: "Corporation School, Mylapore", location: "Mylapore, Chennai" },
              { number: 102, name: "Govt. School, Mandaveli", location: "Mandaveli, Chennai" },
              { number: 103, name: "Community Hall, Alwarpet", location: "Alwarpet, Chennai" },
              { number: 104, name: "Primary School, RA Puram", location: "RA Puram, Chennai" },
            ],
          },
          {
            name: "T. Nagar",
            pollingStations: [
              { number: 101, name: "Corporation School, T. Nagar", location: "T. Nagar, Chennai" },
              { number: 102, name: "Govt. School, Kodambakkam", location: "Kodambakkam, Chennai" },
              { number: 103, name: "Community Centre, Mambalam", location: "Mambalam, Chennai" },
            ],
          },
        ],
      },
      {
        name: "Salem",
        constituencies: [
          {
            name: "Salem City",
            pollingStations: [
              { number: 101, name: "Government School Booth", location: "Salem Town, Salem" },
              { number: 102, name: "Community Hall Booth", location: "Namakkal Road, Salem" },
              { number: 103, name: "Panchayat Union School", location: "Omalur, Salem" },
            ],
          },
        ],
      },
      {
        name: "Coimbatore",
        constituencies: [
          {
            name: "Coimbatore South",
            pollingStations: [
              { number: 101, name: "Govt. School, RS Puram", location: "RS Puram, Coimbatore" },
              { number: 102, name: "Community Hall, Gandhipuram", location: "Gandhipuram, Coimbatore" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Telangana",
    districts: [
      {
        name: "Hyderabad",
        constituencies: [
          {
            name: "Jubilee Hills",
            pollingStations: [
              { number: 101, name: "Govt. School, Jubilee Hills", location: "Jubilee Hills, Hyderabad" },
              { number: 102, name: "Community Hall, Banjara Hills", location: "Banjara Hills, Hyderabad" },
              { number: 103, name: "Primary School, Film Nagar", location: "Film Nagar, Hyderabad" },
            ],
          },
        ],
      },
      {
        name: "Rangareddy",
        constituencies: [
          {
            name: "LB Nagar",
            pollingStations: [
              { number: 101, name: "Govt. School, LB Nagar", location: "LB Nagar, Hyderabad" },
              { number: 102, name: "Community Hall, Dilsukhnagar", location: "Dilsukhnagar, Hyderabad" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Tripura",
    districts: [
      {
        name: "West Tripura",
        constituencies: [
          {
            name: "Agartala",
            pollingStations: [
              { number: 101, name: "Govt. School, Agartala", location: "Agartala, Tripura" },
              { number: 102, name: "Community Hall, Banamalipur", location: "Banamalipur, Agartala" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Uttar Pradesh",
    districts: [
      {
        name: "Lucknow",
        constituencies: [
          {
            name: "Lucknow Central",
            pollingStations: [
              { number: 101, name: "Govt. School, Hazratganj", location: "Hazratganj, Lucknow" },
              { number: 102, name: "Community Hall, Aminabad", location: "Aminabad, Lucknow" },
              { number: 103, name: "Primary School, Chowk", location: "Chowk, Lucknow" },
              { number: 104, name: "Municipal School, Kaiserbagh", location: "Kaiserbagh, Lucknow" },
            ],
          },
        ],
      },
      {
        name: "Varanasi",
        constituencies: [
          {
            name: "Varanasi City",
            pollingStations: [
              { number: 101, name: "Govt. School, Godowlia", location: "Godowlia, Varanasi" },
              { number: 102, name: "Community Hall, Lanka", location: "Lanka, Varanasi" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Uttarakhand",
    districts: [
      {
        name: "Dehradun",
        constituencies: [
          {
            name: "Dehradun",
            pollingStations: [
              { number: 101, name: "Govt. School, Rajpur Road", location: "Rajpur Road, Dehradun" },
              { number: 102, name: "Community Hall, Clock Tower", location: "Clock Tower, Dehradun" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "West Bengal",
    districts: [
      {
        name: "Kolkata",
        constituencies: [
          {
            name: "Kolkata North",
            pollingStations: [
              { number: 101, name: "Govt. School, Shyambazar", location: "Shyambazar, Kolkata" },
              { number: 102, name: "Community Hall, Bagbazar", location: "Bagbazar, Kolkata" },
              { number: 103, name: "Primary School, Sovabazar", location: "Sovabazar, Kolkata" },
            ],
          },
        ],
      },
    ],
  },
  // --- Union Territories ---
  {
    name: "Andaman & Nicobar Islands",
    districts: [
      {
        name: "South Andaman",
        constituencies: [
          {
            name: "Port Blair",
            pollingStations: [
              { number: 101, name: "Govt. School, Aberdeen Bazaar", location: "Aberdeen Bazaar, Port Blair" },
              { number: 102, name: "Community Hall, Phoenix Bay", location: "Phoenix Bay, Port Blair" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Chandigarh",
    districts: [
      {
        name: "Chandigarh",
        constituencies: [
          {
            name: "Chandigarh",
            pollingStations: [
              { number: 101, name: "Govt. School, Sector 17", location: "Sector 17, Chandigarh" },
              { number: 102, name: "Community Hall, Sector 22", location: "Sector 22, Chandigarh" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Dadra & Nagar Haveli and Daman & Diu",
    districts: [
      {
        name: "Daman",
        constituencies: [
          {
            name: "Daman",
            pollingStations: [
              { number: 101, name: "Govt. School, Nani Daman", location: "Nani Daman" },
              { number: 102, name: "Community Hall, Moti Daman", location: "Moti Daman" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Jammu & Kashmir",
    districts: [
      {
        name: "Srinagar",
        constituencies: [
          {
            name: "Srinagar Central",
            pollingStations: [
              { number: 101, name: "Govt. School, Lal Chowk", location: "Lal Chowk, Srinagar" },
              { number: 102, name: "Community Hall, Dal Gate", location: "Dal Gate, Srinagar" },
            ],
          },
        ],
      },
      {
        name: "Jammu",
        constituencies: [
          {
            name: "Jammu East",
            pollingStations: [
              { number: 101, name: "Govt. School, Gandhi Nagar", location: "Gandhi Nagar, Jammu" },
              { number: 102, name: "Community Hall, Canal Road", location: "Canal Road, Jammu" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Ladakh",
    districts: [
      {
        name: "Leh",
        constituencies: [
          {
            name: "Leh",
            pollingStations: [
              { number: 101, name: "Govt. School, Main Bazaar", location: "Main Bazaar, Leh" },
              { number: 102, name: "Community Hall, Changspa", location: "Changspa, Leh" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Lakshadweep",
    districts: [
      {
        name: "Lakshadweep",
        constituencies: [
          {
            name: "Kavaratti",
            pollingStations: [
              { number: 101, name: "Govt. School, Kavaratti", location: "Kavaratti, Lakshadweep" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Puducherry",
    districts: [
      {
        name: "Puducherry",
        constituencies: [
          {
            name: "Puducherry Town",
            pollingStations: [
              { number: 101, name: "Govt. School, White Town", location: "White Town, Puducherry" },
              { number: 102, name: "Community Hall, MG Road", location: "MG Road, Puducherry" },
            ],
          },
        ],
      },
    ],
  },
];
