import { pool } from "./client";

const createMasterTable = `
    CREATE TABLE IF NOT EXISTS master (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstname VARCHAR(100),
        lastname VARCHAR(100),
        rolename VARCHAR(100),
        role VARCHAR(50),
        phone VARCHAR(20),
        statusmaster VARCHAR(20),
        time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(100),
        ssd VARCHAR(100),
        ssdcaregiven VARCHAR(100),
        firstname VARCHAR(100),
        lastname VARCHAR(100),
        sex VARCHAR(10),
        age INT,
        education_level VARCHAR(100),
        career VARCHAR(100),
        birthday_date DATE,
        blood_group VARCHAR(5),
        num_of_house VARCHAR(50),
        group_of_house VARCHAR(50),
        alley_of_house VARCHAR(100),
        street_of_house VARCHAR(100),
        tambon VARCHAR(100),
        amphoe VARCHAR(100),
        province VARCHAR(100),
        postcode VARCHAR(10),
        phone VARCHAR(20),
        master_id UUID,
        time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createHealthdataFormTable = `
    CREATE TABLE IF NOT EXISTS healthdata_form (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        elderly_group VARCHAR(255),
        type_of_disability VARCHAR(255),
        cause_of_disability VARCHAR(255),
        financial_support VARCHAR(255),
        medical_treatment_rights VARCHAR(255),
        assistive_equipment VARCHAR(255),
        ability_to_carry_out_daily_activities VARCHAR(255),
        need_for_assistance VARCHAR(255),
        education_and_training VARCHAR(255),
        career_and_work VARCHAR(255),
        congenital_disease VARCHAR(255),
        history_of_illness VARCHAR(255),
        surgery_history BOOLEAN,
        drug_allergy_history BOOLEAN,
        history_of_food_allergies BOOLEAN,
        users_id UUID,
        master_id UUID,
        time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createHealthrecordsFormTable = `
    CREATE TABLE IF NOT EXISTS health_records_form (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        blood_pressure TEXT,
        weight DECIMAL(5, 2), 
        height DECIMAL(5, 2),   
        waistline DECIMAL(5, 2),
        users_id UUID,
        master_id UUID,
        time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createADLFormTable = `
    CREATE TABLE IF NOT EXISTS adl_form (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        one INT,
        two INT,
        three INT,
        four INT,
        five INT,
        six INT,
        seven INT,
        eight INT,
        nine INT,
        ten INT,
        adl_point INT,
        adl_target VARCHAR(255),
        users_id UUID,
        master_id UUID,
        time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createCaregivenTable = `
    CREATE TABLE IF NOT EXISTS caregiven (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ssd VARCHAR(100),                   
        firstname VARCHAR(100),             
        lastname VARCHAR(100),                
        sex VARCHAR(10),                       
        age INT,                                 
        birthday_date DATE,                     
        num_of_house VARCHAR(50),             
        group_of_house VARCHAR(50),           
        alley_of_house VARCHAR(100),         
        street_of_house VARCHAR(100),       
        tambon VARCHAR(100),                  
        amphoe VARCHAR(100),           
        province VARCHAR(100),              
        postcode VARCHAR(10),               
        phone VARCHAR(20),                  
        line_id VARCHAR(100),          
        education_level VARCHAR(100),         
        email VARCHAR(255),             
        career VARCHAR(100),                 
        caregiver VARCHAR(100),           
        operating_area VARCHAR(100),         
        master_id UUID,
        time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createSurgeryhistoryTable = `
    CREATE TABLE IF NOT EXISTS surgery_history_table (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        year INT,               
        hospital TEXT,        
        healthdata_form_id UUID
    );
`;

const createDrugallergyhistoryTable = `
    CREATE TABLE IF NOT EXISTS drug_allergy_history_table (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        drug_name VARCHAR(255),               
        drug_allergic_reactions TEXT,        
        healthdata_form_id UUID
    );
`;

const createHistoryoffoodallergiesTable = `
    CREATE TABLE IF NOT EXISTS history_of_food_allergies_table (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        food_name TEXT,               
        food_allergic_reactions TEXT,        
        healthdata_form_id UUID
    );
`;

const createuserandcaregivenTable = `
    CREATE TABLE IF NOT EXISTS user_and_caregiven (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        users_id UUID,               
        caregiven_id UUID,
        time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createvillageTable = `
    CREATE TABLE IF NOT EXISTS village (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT             
    );
`;

const map = `
    CREATE TABLE IF NOT EXISTS map (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        num_of_house TEXT,
        group_of_house TEXT,
        latitude DECIMAL(5, 2),
        longitude DECIMAL(5, 2),
        time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createTables = async () => {
  try {
    await pool.query(createMasterTable);
    await pool.query(createUserTable);
    await pool.query(createHealthdataFormTable);
    await pool.query(createHealthrecordsFormTable);
    await pool.query(createADLFormTable);
    await pool.query(createCaregivenTable);
    await pool.query(createSurgeryhistoryTable);
    await pool.query(createDrugallergyhistoryTable);
    await pool.query(createHistoryoffoodallergiesTable);
    await pool.query(createuserandcaregivenTable);
    await pool.query(createvillageTable);
    await pool.query(map);
    console.log("Tables created successfully!");
  } catch (error) {
    console.error("Error creating tables", error);
  }
};

createTables();
