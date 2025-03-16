"use server";

import { prisma } from "@/lib/database/prisma";
import { NextResponse } from "next/server";

export async function frequency(formData: FormData) {
  const students = ((formData.get("students") as string) ?? "")
    .split(",")
    .filter(Boolean);
  const schoolClassId = formData.get("schoolClassId") as string;
  const teacherId = formData.get("teacherId") as string;
  const description = formData.get("description") as string;
  const date = new Date(formData.get("date") as string);

  const schoolClass = await prisma.schoolClass.findFirst({
    where: {
      id: schoolClassId,
    },
    include: {
      studentSchoolClasses: true,
    },
  });

  if (!schoolClass) {
    return;
  }

  const notExistingStudents = students.filter(
    (student) =>
      !schoolClass.studentSchoolClasses.some(
        ({ studentId }) => studentId === student
      )
  );

  if (students.length && notExistingStudents.length) {
    console.log("Students not found", notExistingStudents);
    return;
  }

  const notPresentStudents = schoolClass.studentSchoolClasses.filter(
    ({ studentId }) => !students.includes(studentId)
  );

  const studentsUpdate = [
    ...students.map((student) => ({
      studentSchoolClassId: schoolClass.studentSchoolClasses.find(
        ({ studentId }) => studentId === student
      )!.id,
      presente: true,
    })),
    ...notPresentStudents.map(({ id }) => ({
      studentSchoolClassId: id,
      presente: false,
    })),
  ];

  const frequency = await prisma.session.upsert({
    create: {
      description,
      frequencies: {
        createMany: {
          data: studentsUpdate,
        },
      },
      date,
      teacherId,
      schoolClassId,
    },
    update: {
      description,
      frequencies: {
        updateMany: studentsUpdate.map(
          ({ studentSchoolClassId, presente }) => ({
            where: {
              studentSchoolClassId,
            },
            data: {
              presente,
            },
          })
        ),
      },
    },
    where: {
      date,
      teacherId,
      schoolClassId,
    },
    select: {
      id: true,
      date: true,
      description: true,
      frequencies: true,
    },
  });
}
