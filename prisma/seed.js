const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const doctors = [
  {
    clerkUserId: "seed-doctor-general",
    email: "dr.meera.sharma@example.com",
    name: "Meera Sharma",
    specialty: "General Medicine",
    experience: 9,
    description:
      "Experienced general physician focused on preventive care, fever management, chronic disease follow-ups, and clear patient guidance for everyday health concerns.",
    availability: { startHour: 9, endHour: 13 },
  },
  {
    clerkUserId: "seed-doctor-cardio",
    email: "dr.arjun.mehta@example.com",
    name: "Arjun Mehta",
    specialty: "Cardiology",
    experience: 14,
    description:
      "Cardiologist with a strong focus on hypertension, chest pain evaluation, heart health counseling, and long-term cardiovascular risk reduction.",
    availability: { startHour: 10, endHour: 16 },
  },
  {
    clerkUserId: "seed-doctor-derm",
    email: "dr.nisha.kapoor@example.com",
    name: "Nisha Kapoor",
    specialty: "Dermatology",
    experience: 8,
    description:
      "Dermatologist helping patients with acne, eczema, pigmentation, scalp issues, and personalized skincare treatment plans.",
    availability: { startHour: 11, endHour: 15 },
  },
  {
    clerkUserId: "seed-doctor-neuro",
    email: "dr.raghav.iyer@example.com",
    name: "Raghav Iyer",
    specialty: "Neurology",
    experience: 12,
    description:
      "Neurology specialist supporting patients with headaches, migraines, neuropathy, dizziness, and neurological symptom assessment.",
    availability: { startHour: 8, endHour: 12 },
  },
  {
    clerkUserId: "seed-doctor-peds",
    email: "dr.ananya.rao@example.com",
    name: "Ananya Rao",
    specialty: "Pediatrics",
    experience: 10,
    description:
      "Pediatrician dedicated to child wellness, vaccination guidance, common infections, growth monitoring, and parent counseling.",
    availability: { startHour: 9, endHour: 14 },
  },
  {
    clerkUserId: "seed-doctor-ortho",
    email: "dr.karan.singh@example.com",
    name: "Karan Singh",
    specialty: "Orthopedics",
    experience: 11,
    description:
      "Orthopedic doctor focused on joint pain, sports injuries, posture concerns, mobility issues, and recovery planning.",
    availability: { startHour: 12, endHour: 17 },
  },
];

function nextUtcDateAtHour(startHour, endHour) {
  const now = new Date();
  const start = new Date(now);
  start.setUTCDate(now.getUTCDate() + 1);
  start.setUTCHours(startHour, 0, 0, 0);

  const end = new Date(start);
  end.setUTCHours(endHour, 0, 0, 0);

  return { start, end };
}

async function main() {
  for (const doctor of doctors) {
    const savedDoctor = await prisma.user.upsert({
      where: {
        clerkUserId: doctor.clerkUserId,
      },
      update: {
        email: doctor.email,
        name: doctor.name,
        role: "DOCTOR",
        specialty: doctor.specialty,
        experience: doctor.experience,
        description: doctor.description,
        verificationStatus: "VERIFIED",
      },
      create: {
        clerkUserId: doctor.clerkUserId,
        email: doctor.email,
        name: doctor.name,
        role: "DOCTOR",
        specialty: doctor.specialty,
        experience: doctor.experience,
        description: doctor.description,
        verificationStatus: "VERIFIED",
      },
    });

    const { start, end } = nextUtcDateAtHour(
      doctor.availability.startHour,
      doctor.availability.endHour
    );

    await prisma.availability.deleteMany({
      where: {
        doctorId: savedDoctor.id,
      },
    });

    await prisma.availability.create({
      data: {
        doctorId: savedDoctor.id,
        startTime: start,
        endTime: end,
        status: "AVAILABLE",
      },
    });
  }

  console.log(`Seeded ${doctors.length} sample doctors with availability.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed doctors:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
