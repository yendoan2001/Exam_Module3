const url = require('url');
const qs = require('qs');
const BaseController = require("./base.controller");
const _handle = require("../../handler/handle");

class StudentController extends BaseController {
    async showFormAdd(req, res) {
        let data = await _handle.getTemplate('./view/add.html')
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    }

    addStudent(req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', async () => {
            const student = qs.parse(data);
            const sql = `INSERT INTO Student (Name, Class, TheoryMark, PracticeMark, Evaluate, Describes)
                         values ("${student.nameAdd}",
                                 "${student.classAdd}",
                                 +${student.theoryMarkAdd},
                                 +${student.practiceMarkAdd},
                                 "${student.evaluateAdd}",
                                 "${student.describesAdd}")`;
            await this.querySQL(sql);
            res.writeHead(301, {'Location': '/'});
            return res.end();
        });
    }

    async showListStudent(req, res) {
        const sql = 'SELECT ID,Name,Class,Evaluate FROM Student limit 10';
        let students = await this.querySQL(sql);
        let html = '';
        students.forEach((student, index) => {
            html += `<tr>`;
            html += `<th>${index+1}</th>`
            html += `<th>${student.Name}</th>`
            html += `<th>${student.Class}</th>`
            html += `<th>${student.Evaluate}</th>`
            html += `<th><a onclick="return confirm('Are you sure?')" href="delete?ID=${student.ID}" class="btn btn-primary m-1">Delete</a><a href="update?ID=${student.ID}" class="btn btn-danger m-1">Update</a><a href="detail?ID=${student.ID}" class="btn btn-primary m-1">Detail</a></th>`
            html += `</tr>`
        })
        let data = await _handle.getTemplate('./view/list.html');
        data = data.replace('{list-student}', html);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    }
    async showFormUpdate(req,res){
        let data = await _handle.getTemplate('./view/update.html')
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    }
    updateStudent(req, res){
        let parseUrl = url.parse(req.url, true);
        let queryStringObject = parseUrl.query;
        let id = queryStringObject.ID;
        let data = '';
        req.on('data', chunk => data += chunk)
        req.on('end', async () => {
            let student = qs.parse(data);
            const sql = `UPDATE Student
                     SET Name = '${student.nameUpdate}', 
                         Class = '${student.classUpdate}',
                         TheoryMark = '${student.theoryMarkUpdate}', 
                         PracticeMark = '${student.practiceMarkUpdate}',
                         Evaluate = '${student.evaluateUpdate}', 
                         Describes ='${student.descriptionUpdate}'
                     WHERE ID = '${id}';`
            await this.querySQL(sql);
            res.writeHead(301,{'Location': '/'});
            res.end();
        })
    }
    async deleteStudent(req, res){
        let parseUrl = url.parse(req.url, true);
        let queryStringObject = parseUrl.query;
        let id = queryStringObject.ID;
        const sql = `DELETE
                     FROM Student
                     WHERE ID = '${id}'`;
        await this.querySQL(sql);
        res.writeHead(301, {'Location': '/'})
        res.end();
    }
    async showDetail(req, res){
        let parseUrl = url.parse(req.url, true);
        let queryStringObject = parseUrl.query;
        let id = queryStringObject.ID;
        const sql = `SELECT * FROM Student WHERE ID ='${id}'`;
        let result = await this.querySQL(sql);
        let dataStudent = result[0];
        let studentName = dataStudent.Name;
        let studentClass = dataStudent.Class;
        let studentTheoryMark = dataStudent.TheoryMark;
        let studentPracticeMark= dataStudent.PracticeMark;
        let studentEvaluate = dataStudent.Evaluate;
        let studentDescribes = dataStudent.Describes;

        let data = await _handle.getTemplate('./view/detail.html');
        data = data.replace('{nameStudent}',studentName );
        data = data.replace('{class}',studentClass);
        data = data.replace('{theoryMark}',studentTheoryMark);
        data = data.replace('{practiceMark}',studentPracticeMark);
        data = data.replace('{evaluate}',studentEvaluate);
        data = data.replace('{describes}',studentDescribes);
        res.writeHead(200, {'Content-type': 'text/html'});
        res.write(data);
        res.end();

    }

}
module.exports = StudentController;