import { Request, Response } from "express";
import { pool } from "../db/client";
import bcrypt from "bcrypt";
import {
  RequestWithToken,
  ifnotLogin,
  ifnotRoleADMIN,
} from "../authen/authMiddleware";

export const createMaster = async (req: RequestWithToken, res: Response) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    let role;
    if (req.body.rolename === "เจ้าหน้าที่") {
      role = "ADMIN";
    } else if (req.body.rolename === "อสม.") {
      role = "USER";
    } else {
      role = req.body.role;
    }

    const checkUsername = await pool.query(
      "SELECT * FROM master WHERE username = $1",
      [req.body.username]
    );
    if (checkUsername.rows.length === 0) {
      const result = await pool.query(
        "INSERT INTO master (username,password,firstname,lastname,rolename,role,phone,statusmaster) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
        [
          req.body.username,
          hashPassword,
          req.body.firstname,
          req.body.lastname,
          req.body.rolename,
          role,
          req.body.phone,
          "READY",
        ]
      );
      return res.status(200).send(`Complete Create`);
    } else {
      return res.status(400).send(`Username has already been used`);
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

export const updateStatusMaster = async (
  req: RequestWithToken,
  res: Response
) => {
  try {
    const checkStatus = await pool.query(
      `SELECT statusmaster FROM master WHERE id = $1`,
      [req.params.id]
    );
    const checkid = await pool.query(`SELECT id FROM master WHERE id = $1`, [
      req.params.id,
    ]);
    if (checkid.rows.length === 0) {
      return res.status(404).send(`ID Not Found`);
    }

    let result;

    if (checkStatus.rows[0].statusmaster === "READY") {
      result = await pool.query(
        `UPDATE master SET statusmaster = $1 WHERE id = $2 RETURNING *`,
        ["NOTREADY", req.params.id]
      );
    }
    if (checkStatus.rows[0].statusmaster === "NOTREADY") {
      result = await pool.query(
        `UPDATE master SET statusmaster = $1 WHERE id = $2 RETURNING *`,
        ["READY", req.params.id]
      );
    }

    res.status(200).json({
      id: result?.rows[0].id,
      firstname: result?.rows[0].firstname,
      lastname: result?.rows[0].lastname,
      role: result?.rows[0].role,
      statusmaster: result?.rows[0].statusmaster,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const allMaster = async (req: RequestWithToken, res: Response) => {
  try {
    const allMaster = await pool.query(
      "SELECT id,firstname,lastname,rolename FROM master"
    );

    if (allMaster.rowCount === 0) {
      res.status(404).send("Not Found");
    }

    return res.status(200).json({
      countallMaster: allMaster.rowCount,
      allMaster: allMaster.rows,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getProfile = async (req: RequestWithToken, res: Response) => {
  try {
    const Master = await pool.query(
      "SELECT id,username,firstname,lastname,phone,rolename,statusmaster FROM master WHERE id = $1",
      [req.params.id]
    );

    if (Master.rows.length > 0) {
      return res.status(200).json({
        Master: Master.rows,
      });
    } else {
      res.status(404).send(`Profile not found`);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getProfileMe = async (req: RequestWithToken, res: Response) => {
  try {
    const Master = await pool.query(
      "SELECT id,username,firstname,lastname,phone,rolename FROM master WHERE id = $1",
      [req.token?.id]
    );

    if (Master.rows.length > 0) {
      return res.status(200).json({
        Master: Master.rows,
      });
    } else {
      res.status(404).send(`Profile not found`);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const editProfile = async (req: RequestWithToken, res: Response) => {
  try {
    const { username, firstname, lastname, phone } = req.body;
    const userId = req.params.id;

    const currentProfileQuery = `
            SELECT username, firstname, lastname, phone
            FROM master
            WHERE id = $1
        `;

    const currentProfileResult = await pool.query(currentProfileQuery, [
      userId,
    ]);
    const currentProfile = currentProfileResult.rows[0];

    const updatedProfile = {
      username: username || currentProfile.username,
      firstname: firstname || currentProfile.firstname,
      lastname: lastname || currentProfile.lastname,
      phone: phone || currentProfile.phone,
    };

    const updateProfileQuery = `
            UPDATE master
            SET username = $1, firstname = $2, lastname = $3, phone = $4
            WHERE id = $5
            RETURNING *
        `;
    const values = [
      updatedProfile.username,
      updatedProfile.firstname,
      updatedProfile.lastname,
      updatedProfile.phone,
      userId,
    ];
    const updatedProfileResult = await pool.query(updateProfileQuery, values);

    if (updatedProfileResult.rows.length > 0) {
      res.status(200).json({
        message: "Profile updated successfully.",
      });
    } else {
      res.status(404).send("User profile not found or not updated.");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Error updating profile");
  }
};

export const profileMasterByid = async (
  req: RequestWithToken,
  res: Response
) => {
  try {
    const Master = await pool.query(
      "SELECT id,username,firstname,lastname,role,phone FROM master WHERE id = $1",
      [req.token?.id]
    );

    return res.status(200).json({
      Master: Master.rows,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const editProfileMe = async (req: RequestWithToken, res: Response) => {
  try {
    const { username, firstname, lastname, phone } = req.body;
    const userId = req.token?.id;

    const currentProfileQuery = `
            SELECT username, firstname, lastname, phone
            FROM master
            WHERE id = $1
        `;
    const currentProfileResult = await pool.query(currentProfileQuery, [
      userId,
    ]);
    const currentProfile = currentProfileResult.rows[0];

    const updatedProfile = {
      username: username || currentProfile.username,
      firstname: firstname || currentProfile.firstname,
      lastname: lastname || currentProfile.lastname,
      phone: phone || currentProfile.phone,
    };

    const updateProfileQuery = `
            UPDATE master
            SET username = $1, firstname = $2, lastname = $3, phone = $4
            WHERE id = $5
            RETURNING *
        `;
    const values = [
      updatedProfile.username,
      updatedProfile.firstname,
      updatedProfile.lastname,
      updatedProfile.phone,
      userId,
    ];
    const updatedProfileResult = await pool.query(updateProfileQuery, values);

    if (updatedProfileResult.rows.length > 0) {
      res.json({
        message: "Profile updated successfully.",
      });
    } else {
      res.status(404).send("User profile not found or not updated.");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Error updating profile");
  }
};

export const getCaregiven = async (req: RequestWithToken, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const totalCaregivenResult = await pool.query(
      "SELECT COUNT(*) FROM caregiven"
    );
    const totalCaregiven = parseInt(totalCaregivenResult.rows[0].count);

    const caregivenResult = await pool.query(
      `SELECT id, ssd, firstname, lastname, sex, age, phone, caregiver, operating_area 
             FROM caregiven 
             ORDER BY id 
             LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const allCaregiven = caregivenResult.rowCount;

    return res.status(200).json({
      totalCaregiven,
      allCaregiven,
      caregiven: caregivenResult.rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getCaregivenFromuser = async (
  req: RequestWithToken,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT 
                c.id, c.ssd, c.firstname, c.lastname, c.sex, c.age, c.birthday_date, 
                c.num_of_house, c.group_of_house, c.alley_of_house, c.tambon, 
                c.amphoe, c.province, c.postcode, c.phone, c.line_id, c.email, 
                c.education_level, c.career, c.caregiver, c.operating_area 
             FROM 
                user_and_caregiven uac
             INNER JOIN 
                caregiven c ON uac.caregiven_id = c.id
             WHERE 
                uac.users_id = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("No caregiven details found");
    }

    return res.status(200).send(result.rows);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getCaregivenFromId = async (
  req: RequestWithToken,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT 
                id, ssd, firstname, lastname, sex, age, birthday_date, 
                num_of_house, group_of_house, alley_of_house, tambon, 
                amphoe, province, postcode, phone, line_id, email, 
                education_level, career, caregiver, operating_area 
             FROM 
                caregiven
             WHERE 
                id = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("No caregiven details found");
    }

    return res.status(200).send(result.rows);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    // ข้อมูลทั้งหมดที่มีใน db
    const totalAllUserResult = await pool.query("SELECT COUNT(*) FROM users");
    const totalAllUser = parseInt(totalAllUserResult.rows[0].count);

    const totalAllDisabledResult = await pool.query(
      "SELECT COUNT(*) FROM users WHERE type = $1",
      ["มีความพิการ"]
    );
    const totalAllDisabled = parseInt(totalAllDisabledResult.rows[0].count);

    const totalAllNormalResult = await pool.query(
      "SELECT COUNT(*) FROM users WHERE type = $1",
      ["สุขภาวะปกติ"]
    );
    const totalAllNormal = parseInt(totalAllNormalResult.rows[0].count);

    // ข้อมูลทั้งหมดที่แสดงปัจจุบัน
    const allUserResult = await pool.query(
      "SELECT id, ssd, firstname, lastname, sex, age, phone FROM users LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const allDisabledResult = await pool.query(
      "SELECT id, ssd, firstname, lastname, sex, age, phone FROM users WHERE type = $1 LIMIT $2 OFFSET $3",
      ["มีความพิการ", limit, offset]
    );

    const allNormalResult = await pool.query(
      "SELECT id, ssd, firstname, lastname, sex, age, phone FROM users WHERE type = $1 LIMIT $2 OFFSET $3",
      ["สุขภาวะปกติ", limit, offset]
    );

    return res.status(200).json({
      totalAllUser,
      totalAllDisabled,
      totalAllNormal,
      allUser: allUserResult.rows,
      allDisabled: allDisabledResult.rows,
      allNormal: allNormalResult.rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getuserDataFromID = async (
  req: RequestWithToken,
  res: Response
) => {
  try {
    const PersonalData = await pool.query(
      "SELECT id, type, ssd, firstname, lastname, sex, age, education_level, career, birthday_date, blood_group, num_of_house, group_of_house, tambon, amphoe, province, postcode, phone FROM users WHERE id = $1",
      [req.params.id]
    );

    const HelthData = await pool.query(
      `SELECT id, type_of_disability, cause_of_disability, financial_support, medical_treatment_rights,
                    assistive_equipment, ability_to_carry_out_daily_activities, education_and_training, need_for_assistance,
                    congenital_disease, history_of_illness
             FROM healthdata_form
             WHERE users_id = $1
             ORDER BY time_stamp DESC
             LIMIT 1`,
      [req.params.id]
    );

    let surgeryhistoryData: any = [];
    if (HelthData.rows.length > 0) {
      const healthdataFormId = HelthData.rows[0].id;
      const surgeryhistoryHistory = await pool.query(
        `SELECT year, hospital 
                 FROM surgery_history_table
                 WHERE healthdata_form_id = $1`,
        [healthdataFormId]
      );
      surgeryhistoryData = surgeryhistoryHistory.rows;
    }

    let drugAllergyData: any = [];
    if (HelthData.rows.length > 0) {
      const healthdataFormId = HelthData.rows[0].id;
      const drugAllergyHistory = await pool.query(
        `SELECT drug_name, drug_allergic_reactions 
                 FROM drug_allergy_history_table
                 WHERE healthdata_form_id = $1`,
        [healthdataFormId]
      );
      drugAllergyData = drugAllergyHistory.rows;
    }

    let historyoffoodallergiesData: any = [];
    if (HelthData.rows.length > 0) {
      const healthdataFormId = HelthData.rows[0].id;
      const historyoffoodallergiesHistory = await pool.query(
        `SELECT food_name, food_allergic_reactions 
                 FROM history_of_food_allergies_table
                 WHERE healthdata_form_id = $1`,
        [healthdataFormId]
      );
      historyoffoodallergiesData = historyoffoodallergiesHistory.rows;
    }

    return res.status(200).json({
      PersonalData: PersonalData.rows,
      HelthData: HelthData.rows,
      SurgeryhistoryData: surgeryhistoryData,
      DrugAllergyData: drugAllergyData,
      HistoryoffoodallergiesData: historyoffoodallergiesData,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const historyDataRecordsFromID = async (
  req: RequestWithToken,
  res: Response
) => {
  try {
    const result = await pool.query(
      `
        SELECT id, time_stamp, weight, height, blood_pressure, waistline
        FROM health_records_form
        WHERE users_id = $1
        ORDER BY time_stamp DESC
      `,
      [req.params.id]
    );

    if (result.rows.length > 0) {
      res.status(200).send(result.rows);
    } else {
      res.status(404).send("Not Found User");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getusersBySSD = async (req: RequestWithToken, res: Response) => {
  try {
    const resultData = await pool.query(
      "SELECT id, ssd, firstname, lastname, sex, age, phone FROM users WHERE ssd = $1",
      [req.params.id]
    );

    return res.status(200).json(resultData.rows);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getcaregivenBySSD = async (
  req: RequestWithToken,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT id,ssd,firstname,lastname,sex,age,phone,caregiver,operating_area FROM caregiven WHERE ssd = $1`,
      [req.params.id]
    );
    if (result.rowCount === 0) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result.rows);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const dataCaregiven = async (req: RequestWithToken, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id,ssd,firstname,lastname,sex,age,birthday_date,num_of_house,group_of_house,tambon,amphoe,province,postcode,phone,line_id,education_level,email,career,caregiver,operating_area FROM caregiven
         WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length > 0) {
      res.status(200).send(result.rows);
    } else {
      res.status(404).send(`Not Found Caregiven`);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getDataAdlFromId = async (req: Request, res: Response) => {
  const usersId = req.params.id;

  if (!usersId) {
    return res.status(400).json({ error: "Missing users_id parameter" });
  }

  try {
    const query = `
        SELECT time_stamp, adl_point
        FROM adl_form
        WHERE users_id = $1
        ORDER BY time_stamp DESC
      `;
    const result = await pool.query(query, [usersId]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editCaregiven = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const currentDataResult = await pool.query(
      `SELECT ssd, firstname, lastname, sex, age, birthday_date, num_of_house, group_of_house, 
                    alley_of_house, street_of_house, tambon, amphoe, province, postcode, phone, line_id, email, 
                    education_level, career, caregiver, operating_area 
             FROM caregiven 
             WHERE id = $1`,
      [id]
    );

    if (currentDataResult.rowCount === 0) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    const currentData = currentDataResult.rows[0];

    const {
      ssd = currentData.ssd,
      firstname = currentData.firstname,
      lastname = currentData.lastname,
      sex = currentData.sex,
      age = currentData.age,
      birthday_date = currentData.birthday_date,
      num_of_house = currentData.num_of_house,
      group_of_house = currentData.group_of_house,
      alley_of_house = currentData.alley_of_house,
      street_of_house = currentData.street_of_house,
      tambon = currentData.tambon,
      amphoe = currentData.amphoe,
      province = currentData.province,
      postcode = currentData.postcode,
      phone = currentData.phone,
      line_id = currentData.line_id,
      email = currentData.email,
      education_level = currentData.education_level,
      career = currentData.career,
      caregiver = currentData.caregiver,
      operating_area = currentData.operating_area,
    } = req.body;

    const result = await pool.query(
      `UPDATE caregiven 
             SET 
                ssd = $1,
                firstname = $2,
                lastname = $3,
                sex = $4,
                age = $5,
                birthday_date = $6,
                num_of_house = $7,
                group_of_house = $8,
                alley_of_house = $9,
                street_of_house = $10,
                tambon = $11,
                amphoe = $12,
                province = $13,
                postcode = $14,
                phone = $15,
                line_id = $16,
                email = $17,
                education_level = $18,
                career = $19,
                caregiver = $20,
                operating_area = $21
             WHERE id = $22`,
      [
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
        email,
        education_level,
        career,
        caregiver,
        operating_area,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    return res.status(200).json({ message: "Caregiver updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating caregiver", error });
  }
};
