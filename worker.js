/************ CONFIG ************/
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1457278450837749893/RmPQuqqLuGRGVKLep2xRjtp7RM3b32R0c_p-7AVcIkRx8USXNF__tg_Mzk_gkX_0xmy3";
/********************************/

/* ===== STUDENT DATABASE ===== */
const STUDENTS = {
  "68265":"เด็กชาย อิวโก้ แมคโอ เทย์",
  "68038":"เด็กชาย ชินอชิต์ อุดมรัชตะวานิชย์",
  "68169":"เด็กชาย พิชณุตม์ พิริยะสงวนพงศ์",
  "68115":"เด็กชาย นาวี วีระวงศกร",
  "67229":"เด็กชาย ศราวิน บรรลุทรัพย์",
  "67065":"เด็กชาย ณพล ตั้งจาตุรนต์รัศที",
  "67073":"เด็กชาย ณัฏธนันท์ กฤษฎาภค",
  "67240":"เด็กชาย สิกาญจน์ แสงสุริยไทย",
  "67249":"เด็กชาย เสฎฐพงศ์ มหัทธนกุล",
  "67160":"เด็กชาย พัสกรณ์ วัชระประไพพันธ์",
  "66233":"เด็กชาย ธนากร แดงนภาพรกุล",
  "65097":"เด็กชาย ธัญสิริ พระยาน้อย",
  "65119":"เด็กชาย ปรัตถกร โสราช",

  "64029":"นาย ชลภัทร เทศสกุลวงศ์",
  "64182":"นาย ศศะ คะชิมา",
  "64024":"นาย ชยกฤช ถาวรพานิช",
  "64094":"นาย ธีรภัทร ศรีจิตร",
  "64100":"นาย นิธิศ กุลไชย",
  "64110":"นาย ปภังกร โอกาประกาศิต",
  "64089":"นาย ธิปก ตั้งศิริพัฒน์",
  "63106":"นาย ปกป้อง โพธิ์จักร",
  "63222":"นาย สรัล อัสสะบำรุงรัตน์",
  "63219":"นาย ศุภลิน ชื่นไพโรจน์"
};
/* ============================ */

export default {
  async fetch(req, env) {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { sid } = await req.json();

    /* ตรวจรหัสนักเรียน */
    if (!STUDENTS[sid]) {
      return Response.json({ ok:false, msg:"รหัสนักเรียนไม่ถูกต้อง" });
    }

    /* กันเช็กซ้ำ (Server-side) */
    const already = await env.ATTEND.get(sid);
    if (already) {
      return Response.json({ ok:false, msg:"คุณเช็กชื่อไปแล้ว" });
    }

    await env.ATTEND.put(sid, "1");

    /* ส่ง Discord */
    await fetch(DISCORD_WEBHOOK,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        content:
          "เช็กชื่อเข้าเรียน\n" +
          "ชื่อ: " + STUDENTS[sid] + "\n" +
          "รหัส: " + sid + "\n" +
          "เวลา: " + new Date().toLocaleString("th-TH")
      })
    });

    return Response.json({
      ok:true,
      msg:"เช็กชื่อสำเร็จ",
      name: STUDENTS[sid]
    });
  }
};
