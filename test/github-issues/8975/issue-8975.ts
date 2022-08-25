import { expect } from "chai"
import { exec } from "child_process"
import { dirname } from "path"
import rimraf from "rimraf"

describe("cli init command", () => {
    const cliPath = `${dirname(dirname(dirname(__dirname)))}/src/cli.js`
    const databaseOptions = [
        "mysql",
        "mariadb",
        "postgres",
        "cockroachdb",
        "sqlite",
        "better-sqlite3",
        "oracle",
        "mssql",
        "mongodb",
    ]
    const testProjectName = Date.now() + "TestProject"
    const builtSrcDirectory = "build/compiled/src"

    before(async () => {
        const chmodPromise = new Promise<void>((resolve) => {
            exec(`chmod 755 ${cliPath}`, (error, stdout, stderr) => {
                expect(error).to.not.exist
                expect(stderr).to.be.empty

                resolve()
            })
        })

        const copyPromise = new Promise<void>((resolve) => {
            exec(
                `cp package.json ${builtSrcDirectory}`,
                (error, stdout, stderr) => {
                    expect(error).to.not.exist
                    expect(stderr).to.be.empty

                    resolve()
                },
            )
        })

        await Promise.all([chmodPromise, copyPromise])
    })

    after((done) => {
        rimraf(`./${builtSrcDirectory}/package.json`, (error) => {
            expect(error).to.not.exist

            done()
        })
    })

    afterEach((done) => {
        rimraf(`./${testProjectName}`, (error) => {
            expect(error).to.not.exist

            done()
        })
    })

    for (const databaseOption of databaseOptions) {
        it(`should work with ${databaseOption} option`, (done) => {
            exec(
                `${cliPath} init --name ${testProjectName} --database ${databaseOption}`,
                (error, stdout, stderr) => {
                    expect(error).to.not.exist
                    expect(stderr).to.be.empty

                    done()
                },
            )
        }).timeout(90000)
    }
})
