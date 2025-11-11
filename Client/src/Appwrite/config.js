/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
import conf from "../conf/conf";
import { Client, ID, Databases, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.projectId);
    this.databases = new Databases(this.client);
  }

  async addStudent(studentName, studentUsername , userId ) {
    try {
      return await this.databases.createDocument(
        conf.databaseId,
        conf.studentId,
        ID.unique() ,
        {
          studentName,
          studentUsername ,
          userId,
        }
      );
    } catch (error) {
      throw (error)
    }
  }

  async deleteStudent(documentId) {
    try {
      await this.databases.deleteDocument(
        conf.databaseId,
        conf.studentId,
        documentId
      );
      return true;
    } catch (error) {
      throw (error)
    }
  }

  async updateStudent(studentUsername , { studentName, newUserName, userId }) {
    try {
      this.deleteStudent(studentUsername );
      this.addStudent({ studentName, newUserName, userId });
    } catch (error) {
      throw (error)
    }
  }

  async getStudent(studentUsername ) {
    try {
      return await this.databases.getDocument(
        conf.databaseId,
        conf.studentId,
        [Query.equal("$id", studentUsername)]
      )
    } catch (error) {
      return false
    }
  }

  async listStudents(queries=[queries]) {
    try {
      return await this.databases.listDocuments(
        conf.databaseId,
        conf.studentId,
        queries
      );
    } catch (error) {
      throw (error)
    }
  }
}

const service = new Service();

export default service;
