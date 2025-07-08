import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function listBooks() {
  try {
    return await prisma.book.findMany()
  } catch (error) {
    throw error
  }
}

export async function getBook(id: number) {
  try {
    return await prisma.book.findUnique({ where: { id } })
  } catch (error) {
    throw error
  }
}

export async function createBook(data: { title: string; author: string; type: string; description?: string }) {
  try {
    return await prisma.book.create({ data })
  } catch (error) {
    throw error
  }
}

export async function updateBook(id: number, data: { title?: string; author?: string; type?: string; description?: string }) {
  try {
    return await prisma.book.update({ where: { id }, data })
  } catch (error) {
    throw error
  }
}

export async function deleteBook(id: number) {
  try {
    return await prisma.book.delete({ where: { id } })
  } catch (error) {
    throw error
  }
} 