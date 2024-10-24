import { Request, Response } from "express";
import { pool } from "../db/client";
import {
  RequestWithToken,
  ifnotLogin,
  ifnotRoleADMIN,
} from "../authen/authMiddleware";

export const healthDataForm = async (req: RequestWithToken, res: Response) => {
  const {
    ssd,
    elderly_group,
    type_of_disability,
    cause_of_disability,
    financial_support,
    medical_treatment_rights,
    assistive_equipment,
    ability_to_carry_out_daily_activities,
    need_for_assistance,
    education_and_training,
    career_and_work,
    congenital_disease,
    history_of_illness,
    surgery_history,
    surgery_details,
    drug_allergy_history,
    drug_allergy_details,
    history_of_food_allergies,
    history_of_food_details,
  } = req.body;

  try {
    const check = await pool.query("SELECT id FROM users WHERE ssd = $1", [
      ssd,
    ]);
    if (check.rows.length === 0) {
      return res.status(404).json({isError:true,errorMsg:"User not found"})
      
    }
    const userid = check.rows[0].id;

    const query = `
          INSERT INTO healthdata_form (
              elderly_group, type_of_disability, cause_of_disability, financial_support,
              medical_treatment_rights, assistive_equipment, ability_to_carry_out_daily_activities,
              need_for_assistance, education_and_training, career_and_work, congenital_disease,
              history_of_illness, surgery_history, drug_allergy_history, history_of_food_allergies,
              users_id, master_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          RETURNING id;
      `;

    const values = [
      elderly_group,
      type_of_disability,
      cause_of_disability,
      financial_support,
      medical_treatment_rights,
      assistive_equipment,
      ability_to_carry_out_daily_activities,
      need_for_assistance,
      education_and_training,
      career_and_work,
      congenital_disease,
      history_of_illness,
      surgery_history,
      drug_allergy_history,
      history_of_food_allergies,
      userid,
      req.token?.id,
    ];

    const result = await pool.query(query, values);
    const moreDataForm_id = result.rows[0].id;

    // เพิ่มข้อมูลลงในตาราง surgery_history_table
    if (surgery_history && surgery_details && surgery_details.length > 0) {
      for (const surgery of surgery_details) {
        const surgeryQuery =
          "INSERT INTO surgery_history_table (year, hospital, healthdata_form_id) VALUES ($1, $2, $3)";
        const surgeryValues = [surgery.year, surgery.hospital, moreDataForm_id];
        await pool.query(surgeryQuery, surgeryValues);
      }
    }

    // เพิ่มข้อมูลลงในตาราง drug_allergy_history_table
    if (
      drug_allergy_history &&
      drug_allergy_details &&
      drug_allergy_details.length > 0
    ) {
      for (const drug of drug_allergy_details) {
        const drugAllergyQuery =
          "INSERT INTO drug_allergy_history_table (drug_name, drug_allergic_reactions, healthdata_form_id) VALUES ($1, $2, $3)";
        const drugAllergyValues = [
          drug.drug_name,
          drug.drug_allergic_reactions,
          moreDataForm_id,
        ];
        await pool.query(drugAllergyQuery, drugAllergyValues);
      }
    }

    // เพิ่มข้อมูลลงในตาราง history_of_food_allergies_table
    if (
      history_of_food_allergies &&
      history_of_food_details &&
      history_of_food_details.length > 0
    ) {
      for (const food of history_of_food_details) {
        const foodAllergyQuery =
          "INSERT INTO history_of_food_allergies_table (food_name, food_allergic_reactions, healthdata_form_id) VALUES ($1, $2, $3)";
        const foodAllergyValues = [
          food.food_name,
          food.food_allergic_reactions,
          moreDataForm_id,
        ];
        await pool.query(foodAllergyQuery, foodAllergyValues);
      }
    }

    res.status(200).send("Data inserted successfully");
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).send("Internal server error");
  }
};

export const healthDataRecords = async (
  req: RequestWithToken,
  res: Response
) => {
  const { ssd, blood_pressure, weight, height, waistline } = req.body;

  try {
    const check = await pool.query("SELECT id FROM users WHERE ssd = $1", [
      ssd,
    ]);
    if (check.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    const userid = check.rows[0].id;

    const result = await pool.query(
      `INSERT INTO health_records_form (blood_pressure, weight, height, waistline, users_id, master_id) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [blood_pressure, weight, height, waistline, userid, req.token?.id]
    );

    res.status(200).send("INSERT Complete");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const adl_Form = async (req: RequestWithToken, res: Response) => {
  const { ssd, one, two, three, four, five, six, seven, eight, nine, ten } =
    req.body;

  try {
    const check = await pool.query("SELECT id FROM users WHERE ssd = $1", [
      ssd,
    ]);
    if (check.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    const userid = check.rows[0].id;

    

    const resultADL_point = Number(one) + Number(two) + Number(three) + Number(four) + Number(five) + Number(six) + Number(seven) + Number(eight) + Number(nine) + Number(ten);
    console.log(resultADL_point);
    
    let resultADL_target = "";

    if (resultADL_point >= 0 && resultADL_point <= 4) {
      resultADL_target = "กลุ่มติดเตียง 0-4 คะแนน";
    } else if (resultADL_point >= 5 && resultADL_point <= 11) {
      resultADL_target = "กลุ่มติดบ้าน 5-11 คะแนน";
    } else if (resultADL_point >= 12) {
      resultADL_target = "กลุ่มติดสังคม 12+ คะแนน";
    }

    const query =
      "INSERT INTO adl_form (one,two,three,four,five,six,seven,eight,nine,ten,adl_point,adl_target,users_id,master_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *";
    const values = [
      one,
      two,
      three,
      four,
      five,
      six,
      seven,
      eight,
      nine,
      ten,
      resultADL_point,
      resultADL_target,
      userid,
      req.token?.id,
    ];

    const result = await pool.query(query, values);

    res.status(200).send(`successfully`);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const careGiven_form = async (req: RequestWithToken, res: Response) => {
  const {
    ssd,
    firstname,
    lastname,
    sex,
    age,
    birthday_date,
    num_of_house,
    group_of_house,
    alley_of_house,
    street_of_house,
    tambon,
    amphoe,
    province,
    postcode,
    phone,
    line_id,
    education_level,
    email,
    career,
    caregiver,
    operating_area,
  } = req.body;

  const checkssd = await pool.query('SELECT * FROM caregiven WHERE ssd = $1', [ssd]);
  if (checkssd.rowCount === 1) {
    return res.status(409).send('SSD already exists');
  }

  try {
    const query = `
      INSERT INTO caregiven (
        ssd, firstname, lastname, sex, age, birthday_date,
        num_of_house, group_of_house, alley_of_house, street_of_house, tambon, amphoe, province,
        postcode, phone, line_id, education_level, email, career, caregiver, operating_area, master_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *;
    `;

    const values = [
      ssd,
      firstname,
      lastname,
      sex,
      age,
      birthday_date,
      num_of_house,
      group_of_house,
      alley_of_house,
      street_of_house,
      tambon,
      amphoe,
      province,
      postcode,
      phone,
      line_id,
      education_level,
      email,
      career,
      caregiver,
      operating_area,
      req.token?.id,
    ];

    // Execute the query
    await pool.query(query, values);
    res.status(200).send("Data inserted successfully");
  } catch (err) {
    console.error('Error inserting data:', err); // Log the error
    res.status(500).send("An error occurred while inserting data");
  }
};


export const userPersonal = async (req: RequestWithToken, res: Response) => {
  const {
    type,
    ssd,
    ssdcaregiven,
    firstname,
    lastname,
    sex,
    age,
    education_level,
    career,
    birthday_date,
    blood_group,
    num_of_house,
    group_of_house,
    alley_of_house,
    street_of_house,
    tambon,
    amphoe,
    province,
    postcode,
    phone,
  } = req.body;

  try {
    const checkSSD = await pool.query("SELECT * FROM users WHERE ssd = $1", [
      ssd,
    ]);

    if (checkSSD && (checkSSD.rowCount as number) > 0) {
      return res.status(409).send("SSD already exists");
    }

    const query = `
          INSERT INTO users (
              type, ssd, ssdcaregiven, firstname, lastname, sex, age, education_level, career, birthday_date,
              blood_group, num_of_house, group_of_house, alley_of_house, street_of_house, tambon, amphoe, province,
              postcode, phone, master_id
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
          RETURNING id;
      `;

    const values = [
      type,
      ssd,
      ssdcaregiven,
      firstname,
      lastname,
      sex,
      age,
      education_level,
      career,
      birthday_date,
      blood_group,
      num_of_house,
      group_of_house,
      alley_of_house,
      street_of_house,
      tambon,
      amphoe,
      province,
      postcode,
      phone,
      req.token?.id,
    ];

    const result = await pool.query(query, values);
    const userId = result.rows[0].id;

    const caregivenResult = await pool.query(
      `SELECT id FROM caregiven WHERE ssd = $1`,
      [ssdcaregiven]
    );
    const caregivenId = caregivenResult.rows[0]?.id;

    if (caregivenId) {
      await pool.query(
        `INSERT INTO user_and_caregiven (users_id, caregiven_id) VALUES ($1, $2)`,
        [userId, caregivenId]
      );
    }

    res
      .status(200)
      .send("Successfully created user and linked with caregiven.");
  } catch (err) {
    res.status(500).send(err);
  }
};

export const linkCaregiven = async (req: RequestWithToken, res: Response) => {
  try {
    const userResult = await pool.query(`SELECT id FROM users WHERE ssd = $1`, [req.body.user_ssd]);
    const caregivenResult = await pool.query(`SELECT id FROM caregiven WHERE ssd = $1`, [req.body.caregiven_ssd]);

    if (userResult.rowCount === 0 ) {
      return res.status(404).send({ message: "User  not found" });
    }

    if (caregivenResult.rowCount === 0) {
      return res.status(404).send({ message: "Caregiver not found" });
    }

    const users_id = userResult.rows[0].id;
    const caregiven_id = caregivenResult.rows[0].id;

    const check = await pool.query(
      `SELECT * FROM user_and_caregiven WHERE users_id = $1`,
      [users_id] 
    );

    if (check.rowCount === 0) {
      await pool.query(
        `INSERT INTO user_and_caregiven (users_id, caregiven_id) VALUES ($1, $2)`,
        [users_id, caregiven_id]
      );
      return res.status(200).send("Caregiver linked successfully");
    } else {
      return res.status(400).send("User already linked with a caregiver");
    }

  } catch (error) {
    return res.status(500).send(error); 
  }
};


