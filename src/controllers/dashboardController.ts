import { Request, Response } from "express";
import { pool } from "../db/client";
import {
  RequestWithToken,
  ifnotLogin,
  ifnotRoleADMIN,
} from "../authen/authMiddleware";

export const dashboardPerson = async (req: RequestWithToken, res: Response) => {
  try {
    const overall = (await pool.query(`SELECT id FROM users`)).rowCount;
    const maleAll = (
      await pool.query(`SELECT id FROM users WHERE sex = 'ชาย' `)
    ).rowCount;
    const femaleAll = (
      await pool.query(`SELECT id FROM users WHERE sex = 'หญิง'`)
    ).rowCount;
    const normalHealth = (
      await pool.query(`SELECT id FROM users WHERE type = 'สุขภาวะปกติ'`)
    ).rowCount;
    const maleNormal = (
      await pool.query(
        `SELECT id FROM users WHERE sex = 'ชาย' AND type = 'สุขภาวะปกติ' `
      )
    ).rowCount;
    const femaleNormal = (
      await pool.query(
        `SELECT id FROM users WHERE sex = 'หญิง' AND type = 'สุขภาวะปกติ'  `
      )
    ).rowCount;
    const disability = (
      await pool.query(`SELECT id FROM users WHERE type = 'มีความพิการ'`)
    ).rowCount;
    const maleDisability = (
      await pool.query(
        `SELECT id FROM users WHERE sex = 'ชาย' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const femaleDisability = (
      await pool.query(
        `SELECT id FROM users WHERE sex = 'หญิง' AND type = 'มีความพิการ'  `
      )
    ).rowCount;

    res.status(200).json({
      userAll: [
        {
          overall: overall,
          maleAll: maleAll,
          femaleAll: femaleAll,
          normalHealth: normalHealth,
          maleNormal: maleNormal,
          femaleNormal: femaleNormal,
          disability: disability,
          maleDisability: maleDisability,
          femaleDisability: femaleDisability,
        },
      ],
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const dashboardTypes = async (req: RequestWithToken, res: Response) => {
  try {
    const visuallyImpaired = (
      await pool.query(
        ` SELECT DISTINCT users_id, type_of_disability FROM healthdata_form WHERE type_of_disability = 'ทางการมองเห็น'`
      )
    ).rowCount;
    const PhysicallyDisabled = (
      await pool.query(
        ` SELECT DISTINCT users_id, type_of_disability FROM healthdata_form WHERE type_of_disability = 'ทางการเคลื่อนไหว'`
      )
    ).rowCount;
    const hearingAndCommunicationImpaired = (
      await pool.query(
        ` SELECT DISTINCT users_id, type_of_disability FROM healthdata_form WHERE type_of_disability = 'ทางการได้ยินและสื่อความหมาย'`
      )
    ).rowCount;
    const mentalAndBehavioralDisabilities = (
      await pool.query(
        ` SELECT DISTINCT users_id, type_of_disability FROM healthdata_form WHERE type_of_disability = 'ทางจิตใจและพฤติกรรม'`
      )
    ).rowCount;
    const intellectuallyDisabled = (
      await pool.query(
        ` SELECT DISTINCT users_id, type_of_disability FROM healthdata_form WHERE type_of_disability = 'ทางสติปัญญา'`
      )
    ).rowCount;
    const learningDisabilities = (
      await pool.query(
        ` SELECT DISTINCT users_id, type_of_disability FROM healthdata_form WHERE type_of_disability = 'ทางการเรียนรู้'`
      )
    ).rowCount;
    const autisticDisability = (
      await pool.query(
        ` SELECT DISTINCT users_id, type_of_disability FROM healthdata_form WHERE type_of_disability = 'ทางออทิสติค'`
      )
    ).rowCount;
    const moreThanOneTypeOfDisability = (
      await pool.query(
        ` SELECT DISTINCT users_id, type_of_disability FROM healthdata_form WHERE type_of_disability = 'พิการมากกว่า 1 ประเภท'`
      )
    ).rowCount;

    res.status(200).json({
      typeAll: [
        {
          visuallyImpaired: visuallyImpaired,
          PhysicallyDisabled: PhysicallyDisabled,
          hearingAndCommunicationImpaired: hearingAndCommunicationImpaired,
          mentalAndBehavioralDisabilities: mentalAndBehavioralDisabilities,
          intellectuallyDisabled: intellectuallyDisabled,
          learningDisabilities: learningDisabilities,
          autisticDisability: autisticDisability,
          moreThanOneTypeOfDisability: moreThanOneTypeOfDisability,
        },
      ],
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const dashboardBarVillage = async (
  req: RequestWithToken,
  res: Response
) => {
  try {
    const village1 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 1 บ้านหลวง' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village2 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 2 บ้านแพทย์' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village3 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 2 บ้านปงสนุก' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village4 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 3 บ้านปิน' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village5 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 4 บ้านไชยสถาน' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village6 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 5 บ้านท่าม่าน' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village7 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 6 บ้านหล่ายทุ่ง' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village8 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 7 บ้านสบทราย' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village9 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 8 บ้านใหม่' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village10 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 9 บ้านกลาง' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village11 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 10 บ้านป่าซางคำ' AND type = 'มีความพิการ' `
      )
    ).rowCount;

    res.status(200).json({
      values: [
        village1,
        village2,
        village3,
        village4,
        village5,
        village6,
        village7,
        village8,
        village9,
        village10,
        village11,
      ],
    });
    
    
  } catch (error) {
    res.status(500).send(error);
  }
};

export const dashboardCircleVillage = async (
  req: RequestWithToken,
  res: Response
) => {
  try {
    const village1 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 1 บ้านหลวง' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village2 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 2 บ้านแพทย์' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village3 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 2 บ้านปงสนุก' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village4 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 3 บ้านปิน' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village5 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 4 บ้านไชยสถาน' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village6 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 5 บ้านท่าม่าน' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village7 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 6 บ้านหล่ายทุ่ง' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village8 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 7 บ้านสบทราย' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village9 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 8 บ้านใหม่' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village10 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 9 บ้านกลาง' AND type = 'มีความพิการ' `
      )
    ).rowCount;
    const village11 = (
      await pool.query(
        `SELECT id FROM users WHERE group_of_house = 'หมู่ที่ 10 บ้านป่าซางคำ' AND type = 'มีความพิการ' `
      )
    ).rowCount;

    res.status(200).json({
      villageAll: [
        { id: 0, label: "หมู่ที่ 1 บ้านหลวง", value: village1 },
        { id: 1, label: "หมู่ที่ 2 บ้านแพทย์", value: village2 },
        { id: 2, label: "หมู่ที่ 2 บ้านปงสนุก", value: village3 },
        { id: 3, label: "หมู่ที่ 3 บ้านปิน", value: village4 },
        { id: 4, label: "หมู่ที่ 4 บ้านไชยสถาน", value: village5 },
        { id: 5, label: "หมู่ที่ 5 บ้านท่าม่าน", value: village6 },
        { id: 6, label: "หมู่ที่ 6 บ้านหล่ายทุ่ง", value: village7 },
        { id: 7, label: "หมู่ที่ 7 บ้านสบทราย", value: village8 },
        { id: 8, label: "หมู่ที่ 8 บ้านใหม่", value: village9 },
        { id: 9, label: "หมู่ที่ 9 บ้านกลาง", value: village10 },
        { id: 10, label: "หมู่ที่ 10 บ้านป่าซางคำ", value: village11 },
      ],
    });
    
  } catch (error) {
    res.status(500).send(error);
  }
};

export const dashboardMap = async (req: RequestWithToken, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
                m.latitude,
                m.longitude,
                u.type    
            FROM 
                map m
             JOIN 
                users u 
             ON 
                m.num_of_house = u.num_of_house 
             AND 
                m.group_of_house = u.group_of_house`
    );

    const offset = 0.0002;

    const coordinateMap = new Map<
      string,
      { latitude: number; longitude: number }
    >();

    const adjustedData = result.rows.map((row) => {
      let { latitude, longitude, type } = row;
      latitude = parseFloat(latitude);
      longitude = parseFloat(longitude);

      const key = `${latitude},${longitude}`;

      const previousOffset = coordinateMap.get(key);

      if (previousOffset) {
        latitude = previousOffset.latitude + (Math.random() - 1) * offset;
        longitude = previousOffset.longitude + (Math.random() - 1) * offset;
        coordinateMap.set(key, { latitude, longitude });
      } else {
        coordinateMap.set(key, { latitude, longitude });
      }

      return { latitude, longitude, type };
    });

    const normal = adjustedData.filter((row) => row.type === "สุขภาวะปกติ");
    const disability = adjustedData.filter((row) => row.type === "มีความพิการ");

    res.status(200).json({ normal, disability });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const insertedMap = async (req: RequestWithToken, res: Response) => {
  const { num_of_house, group_of_house, latitude, longitude } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO map (num_of_house,group_of_house,latitude,longitude) VALUES($1,$2,$3,$4) RETURNING id`,
      [num_of_house, group_of_house, latitude, longitude]
    );
    res.status(200).send(`INSERT COMPLETE`);
  } catch (error) {
    res.status(500).send(error);
  }
};
