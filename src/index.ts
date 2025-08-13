import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();
const app = express();
app.use(express.json());

app.post('/mcp', async (req: Request, res: Response) => {
    try {
        const cookie = req.headers['cookie'];
        if (!cookie) {
            console.log("Cookie is required");
        }
        const staticHeaders = {
            'accept': 'application/json',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,nl;q=0.7',
            'priority': 'u=1, i',
            'content-type': 'application/json',
            'authorization': 'Basic bjJnN2ROVzY6MzNubUFMM3U=',
            'consumer-id': 'AAB.SYS.024193',
            'referer': 'https://www-et1.abnamro.nl/mijn-abnamro/betalen/bij-en-afschrijvingen/',
            'request-id': '|38e9e41efd8e46b4b3963df7d2ae1f77.07eab036015b4c8b',
            'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'traceparent': '00-38e9e41efd8e46b4b3963df7d2ae1f77-07eab036015b4c8b-01',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
            'x-aab-serviceversion': 'v3',
            'origin': 'https://www-et1.abnamro.nl',
            'Cookie': cookie,
        }

        const OAMSpecificHeaders = {
            "accept": "application/json",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "authorization": "Basic bjJnN2ROVzY6MzNubUFMM3U=",
            "pii-customer-id": "3936759",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "source": "OAM",
            "trace-id": "OAM1751588218663",
            "x-xsrf-header": "test, token",
            "cookie": "_ga=GA1.1.1676669614.1684767593; _fbp=fb.1.1741960445838.723562545208482852; CONSENTMGR=consent:true%7Cts:1744011761078; _gcl_au=1.1.185697401.1746109468; ai_user=KJyDQ9ed6AkkMD4glW5onV|2025-06-12T11:05:47.065Z; UVID=9d78002f-d6b6-4104-a054-29fec5906985; OptanonAlertBoxClosed=2025-06-12T13:36:43.337Z; at_check=true; AMCVS_0861467352782C5E0A490D45%40AdobeOrg=1; configSessionCORS=4acdcdbc200d3112a34d57107fdaa171; configSession=4acdcdbc200d3112a34d57107fdaa171; LBCSS2=000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000; AMCV_0861467352782C5E0A490D45%40AdobeOrg=-2121179033%7CMCIDTS%7C20273%7CMCMID%7C18140994401715921201522593210400569253%7CMCAAMLH-1752184622%7C6%7CMCAAMB-1752184622%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1751587022s%7CNONE%7CMCAID%7C323671FCDB01702B-400019B7E285E07B%7CvVersion%7C5.3.0; optimizelySession=0; csd_session_id=9434b38c-de4f-49e5-af87-895e7c8b5116; _ga_H38ZZ0N44L=GS2.1.s1751580687$o63$g1$t1751580791$j16$l0$h0; s_cc=true; s_fid=0D1D1746A0CD9471-1F22502AC7F87A10; s_sq=%5B%5BB%5D%5D; JSESSIONID=ABC64AF500ADD57F4DBAD4656E9A4BA5; Homepage={\"language\":\"EN\",\"segment\":\"personal\"}; ApplicationGatewayAffinityCORS=9a440b08dd9ab48cc8e5c138294e64d0; ApplicationGatewayAffinity=9a440b08dd9ab48cc8e5c138294e64d0; Segment=dd47e61b-2993-4902-ab8a-c07e0d9d1c9f; LBCSS=000070000100000001000000000000000000000000000000000p0000001000000001100110000000000100001017111000000010100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000; akacd_DEQ_ET=1752017285~rv=19~id=804d27775773baa97784281550705bf5; SMSession=AZMzm3-DeyCqmYBpkdIMI0BAmrjS5jD1Mqem5y8kMhEZAFlhqy5KlT4MmdEWdIbEDFm4g1DyBBgDCvK-vGe764o=; WSESSIONID=0000Xf8CuONBHYCJrd3C8AAsyO8:-1; mboxEdgeCluster=37; ai_sessionibcs-contextualshop-app=m2AA8MnqViVj/PBJBatpPg|1751587150320|1751587169901; mbox=PC#6b36b971ad204a90b00c902cfd0e48b0.37_0#1814831970|session#819d19d8290f4fa29bca923170c82561#1751589030; akacd_Payments_BORG_ET=1752019170~rv=25~id=b273fc2935e9749ca24c2c22ea954533; ai_session=kTww//xXi4/kZwEERSPkq8|1751580230364|1751588169844; bm_mi=1572C2459525B84B49391C3F317247B7~YAAQH44QAmptfLOXAQAAxe/K0hyG7I+R8oi99LeKzIr3Nk/n73NHiiDYs19IdQbMGjgwRsimzw+CXwCZX7KloNY5ellWXUrLvStqnZUdaHpNqPr+kTL8ly34Xd9i/cPE0c9cemsDj7aLN0rIEJoWS2EZai8jJj3FIn4Y4ooqMbiLE2RxPTEugy7ZVthGAguz1wvqR9VBr/JIrpvvN+ZzVl5CO3KqbXXmRi/PzHrkT0t1E5i7XiBZdw3ey8sgLjDLvLPLNdrbmJTorQZuX9cH5SlWfrw2DGA97Hwl+3BSTdD5I1ZaA5028AqF1iudT/HWxSit/PBhtVu+istfiwT6djZV/5GGfNKf+2Nl7XqDMRIvD6hnJN8=~1; TS01761d53=01e142acc96e99b7314c3982bef979220a44d2050e7f2dd768d6ce4702416813636814414e47c773f46f4a2d0fba55c10bccd9d501; ai_sessionheaderlog=M0yIK+KU4f47BwOe29TP0r|1751585283639|1751588205874; ai_sessionfooterlog=kd3jS54NI4MmOhH+U1m2nV|1751585285859|1751588206486; __Host-AAB.retail=eyJ6aXAiOiJERUYiLCJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwia2lkIjoiT2JmWmpPNGNqdE1LVUtpd3pEVHpiSUg4UFQ4IiwicGkuc3JpIjoidk5XY3VyTkdzbVUxNkZZa1J5b2RNUndOem9rLi5aeDF1In0..5DZiQoF3bUYJIruE.IvHzAb21UbKcznyuv_E5RSiuxBwo_fimqgPw8WFTepMYkNwnEmKTHpDw7UFZCsVnfgqPQ3IRBeZdjbvQPw9Kfiw3Hbs9iPNUWOZwalNhHpZGjanqzmYGzwZqCR7fdpuHKeGLbU6-Q_H_E1SLvyKYyXZlHWc68fPnK-dVTT054JxwrAYm9XsFf9XsViijY4BQmCuEIp_L2vcrBhDRT36lmk4-1P4qeJCyo12sDZFWH0eOm63LevDKU2Tgc8iYKa_709CjG5qPJBVALUFK00SJjjwCMejC7pXmbwz1SCXLxEiikpuM4IW0wRbPswU8PGz10z8gqA7jMBvwm7ITtvxVa55NyC0SxLgeI8NZKGJzH8gXM4pvuAZDQLmZ_2lFiwvpf2aqFT0SaVh32cJOddGMWiCgfTRzTzE3ebJSTHN2R2CPzSgBVh5xWEtkxlwD1sVfH8GPOK72ZRWmIIZ64JKzu3zlk1a4n5ruQOJ5_SpLvCqSpauR0z5NUvaIXpaUlGl-HyEOaDUlkwHXKUo-g7CxNbkmwr-Ebt4J6sjJpZTxeeBK6gvnJ49x61qQhIXKVtQWOMVRUuL3kylFX6mDKWnCsrR0bnp1ylSMd4oJDiwgz8FbLo4zFMCEtoKU8aRAS7V7vBY2ffBJcbALTFcKZE23ZrRVLwpD1-I63LTSaS4fu_ptWsNCUjXVPIEqHskU3VKa7okaLpjirvXlLjvn7jfF8EyldtEo1Q.5su1AtWG7eEdGqwcE0rbOg; bm_sz=D7C8D0CB077120F282BE7ABDDAC951F7~YAAQH44QAqdufLOXAQAAiB7L0hzPBaYUs10NHgzF4LdBGkrfOQE1XXexJLkvLud/0W1pEtuYXPVeGemSRq6F+NVtxsQlWdO7a+ZS15R5pPX/bVBhgCNlFL7khVmTiI32a6fK11d0IbTprJOZB33KCbk1M1C4YUTg/XmBQhM2P6UeBrawhjloEez1rwC2/8ht0xvsmUE/WYdQgoYIoilVOar5seRpZcCdcQ/w6hhhFqubRnhuw743rUGkpLDwV7cjgMRQl6t5W4mAOL1vao8GKY7zbKh5ZIu7CV/sA1iDUhDMzLLKYQGKR10xUQAbLhZn5XKejkTP60m201ujvKabxHQyizVs810gMM3DKYkOvKMnTFqqcHbIfRN+aKhe/f50LsH8AX+wl7QmaouX0Eqa+tBNdJyWNusY39n2RJjDToiou0tYC8uQFcaxZGdvJZg1Zr2cH4uXNTFRwUdnwXfIHa7WMXQvWFoV1u4JVVglHu7maxHQwlAxX+UBqBw8iBAXyodL6EWEoohG6HNLm7epjxIJl0g+yJiODYiC0AdkNpo3sms9fF3CoYz6heFbnWYC5pew4WjPZvQhdaBZljhTCSaW~4539718~4605250; _abck=4080F2B2002A0285FF2204BBE9A4984F~0~YAAQH44QArxufLOXAQAAQyLL0g6v+3HZAADqudQPm+mKe69wpqCwitYTqvsSamSsdM8dv1wmXfohQ273WI9GKd4eBW6o9K5vC650De3hZNjFV+uxNB5VF31qdd84OzlmZNVrXyWZ0UnzWsW8Jm4K8DZgYmWlHeV3mld4R0W27IDJ0xu0tIyK5hXT317UPVNd/NABBCwJc8yEZD5J6lM704RRD2ifeAY0MqsgDgKpoYBJHohnlmB1wu0ISu+tFsSFOBqq21HwWni2+ZS4Y59Yf+BaJBksN72C8AXNyH9dPAEDmallk3EfDhAx9Qr947W8tdF6mYLMf9trtvts/NPfRu7ATAgZ+2PEmFJYnrJ67eWYw6dKB0jj3Qz/c8Tth0pqKj9qn4aGOL6lVpOEjlNnmVFIIO7yAU6ND0FbMhNuhJJ3vY4RBRTKeZBd4xNFp3GLEhwe+3uGSJ11YaO4O61Tux6Tjd8/arnSfTE7uybqI/J1TmQ3LlBaAJX7iQtZtCWsDJswYR/FOkqWfWcvnSYtTMsGjosLf4/M2yoIAwh88mJwb6purHC5ywJR+Ma7tkGra+xfpUfOKkdpXWtCeT2e5jnmNNZLGLQgoPiH0cCxu4Li0Xpf/Adx9+U3dtbdAG08wsB5VaGPF6sCMbTdocJUImCVG6HTI6PhZ5IN0vNyqIKe3aNP~-1~-1~-1; akacd_Session_IB_ET=1752020218~rv=26~id=34f29a864f10cdb53516298eaa7d68a4; _ga_LDM088LEXT=GS2.1.s1751579825$o11$g1$t1751588218$j48$l0$h0; utag_main=v_id:01976477042e00177e1fee77a6dc05075004d06d009dc$_sn:7$_se:241%3Bexp-session$_ss:0%3Bexp-session$_st:1751590018173%3Bexp-session$ses_id:1751579825329348748%3Bexp-session$_pn:61%3Bexp-session$original_v_id:0197645b6465000e2fabe25bf10905075004306d009dc$dc_visit:1$dc_event:680%3Bexp-session$synced_cookie_dc:1%3Bexp-session$UCID:9c34341a6c7f660ab620417348161bd10344e9cc5d3fda7d15c4edfcb89cafe1$last_user_bc_number:9c34341a6c7f660ab620417348161bd10344e9cc5d3fda7d15c4edfcb89cafe1$internal_et:1; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Jul+04+2025+02%3A16%3A58+GMT%2B0200+(Central+European+Summer+Time)&version=202503.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=96d613e3-06a7-4267-b89b-838172cfcf1d&interactionCount=2&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1&AwaitingReconsent=false&intType=1&geolocation=%3B; ak_bmsc=2D8ECA8B7B15B8F09BCA5C7656D453C4~000000000000000000000000000000~YAAQH44QAt1ufLOXAQAAOSbL0hyuCQ9m3ly9nt4eEBis/usa8DUCDjDx5uPhdd0DTd6WseRQXYZORXcMLXk4DLnYZbiRWmHRvcEkCTUnOJVJcqmXJNv2cf5kVDLJlmvOjORPwiI1BEl+cAAVRScCyJLmPEbUp1OB679Cdy2wK583DDUlb0gzn9Hpfbg5JjYWt+5rV9D+K35iGr0dZHuQkHKEUIUiXIMyw6XmfLaQlH/1Fi6hF5LxNbaANKh1s4vxKx9/mTGJ1EuR53WmfSlBZyN9oFNgRulh4cyHrXOP2Usfotj3NodmYe/ClIZdn/TpuxHkmejLvxwKyD04NRylD6fWlmBQQkG2t3HQpj98c66GDl+zBWtR0yC/SKe4G92EBc9aCI58jzCaBqZV0Y4aQDs9PabOXYlIayPz/Uhb7wBf2IA4UuoWdzlhnTG3iUobHxk1JG+mCvOn0eCIbuBSCvTHa9ZAkZYtgZ165luhI67vCj0vGy43Nh7/mEA04gPJNPAwa5jPbsVTyaHEBZUh5UJiKnU6pR0W; bm_sv=BFE651D742DE06FEC4CF12E702C1DA61~YAAQH44QAuhufLOXAQAAYifL0hwAc7jy8aSvMDfwJ5fdUxlU/dgTWbhwH+zE9gwo+VjOcr8aMf260fPiUoPY1gPza89eZ2NKkyD9iJL9nQWpcSXkLvUobYET4CDRg98A4QTx68l428S5eEiLeJS8AYX+CgF15J48bKfbdkono86Ex2jju5Zoz0L0G9R3l5LoovXe0x/ROHe9Rx8iEeZThxMWCASpUOz64cgNKP6iP0sFUQVk9MuvTCbsoeExP/jSrQ==~1",
            "Referer": "https://www-et1.abnamro.nl/my-abnamro/self-service/general/index.html"
        }

        // Create a new MCP server instance for each request
        const server = new McpServer({
            name: "Demo",
            version: "1.0.0"
        });

        server.tool(
            "calculate-bmi",
            {
                weightKg: z.number().describe("Weight in kilograms"),
                heightM: z.number().describe("Height in meters")
            },
            async ({ weightKg, heightM }) => ({
                content: [{
                    type: "text",
                    text: String(weightKg / (heightM * heightM))
                }]
            })
        );

        // ABN AMRO SEPA Payment Instruction tool
        server.tool(
            "abnamro-sepa-payment-execute",
            "Creates a transfer payment request for ABN AMRO.",
            {
                debitor: z.string().describe("Account number or IBAN of the debtor"),
                creditor: z.string().describe("Account number or IBAN of the creditor"),
                amount: z.string().describe("Amount to be transferred in Euros")
            },
            async ({ debitor, creditor, amount }) => {
                console.log("Received SEPA Payment Instruction:", { debitor, creditor, amount });
                const url = "https://www-et1.abnamro.nl/my-abnamro/api/payments/paymentinstructions/single/sepa?supportFraudMessage=true&paymentContinue=false";
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'accept-language': 'en',
                        'authorization': 'Basic bjJnN2ROVzY6MzNubUFMM3U=',
                        'content-type': 'application/json',
                        'cookie': cookie,
                        'origin': 'https://www-et1.abnamro.nl',
                        'priority': 'u=1, i',
                        'referer': 'https://www-et1.abnamro.nl/my-abnamro/payments/account/',
                        'request-context': 'appId=cid-v1:70813994-87b0-47ee-8856-6b6b163d1930',
                        'request-id': '|ef2d5e688ce748578fd02ca39857d260.e43bcd3a844d4e59',
                        'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"macOS"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-origin',
                        'traceparent': '00-ef2d5e688ce748578fd02ca39857d260-e43bcd3a844d4e59-01',
                        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
                        'x-aab-serviceversion': 'v3'
                    },
                    body: JSON.stringify({
                        "sepaPaymentInstruction": {
                            "orderingParties": [
                                {
                                    "type": "DEBTOR",
                                    "name": "XWI TPSCIDQH O BSMZVIZU"
                                }
                            ],
                            "accountNumber": debitor,
                            "accountCurrency": "EUR",
                            "buildingBlockId": 5,
                            "contractNumber": "594185815",
                            "businessContactNumber": 3936759,
                            "@resourceType": "SepaCreditTransferPaymentInstruction",
                            "paymentInstructionTransactionPart": {
                                "@resourceType": "SepaPaymentInstructionTransactionPart",
                                "accountNumber": creditor,
                                "counterParties": [
                                    {
                                        "type": "CREDITOR",
                                        "name": "XWI TPSCIDQH O BSMZVIZU"
                                    }
                                ],
                                "currencyIsoCode": "EUR",
                                "indicationUrgent": false,
                                "amount": amount,
                                "indicationImmediate": true,
                                "remittanceInfo": "",
                                "remittanceInfoType": "UNSTRUCTURED"
                            }
                        }
                    })
                });
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                console.log(`ABN AMRO Payment Request Response: ${JSON.stringify(data)}`);
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }]
                };
            }
        );

        // ABN AMRO Accounts List tool
        server.tool(
            "abnamro-accounts-list",
            "This tool fetches the list of accounts for the ABN AMRO user. The main account is called 'Personal Account'.",
            {},
            async ({ }) => {
                const url = "https://www-et1.abnamro.nl/my-abnamro/api/payments/contracts/list";
                const response = await fetch(url, {
                    method: 'POST',
                    headers: staticHeaders,
                    body: JSON.stringify({
                        "actionNames": ["VIEW_PORTFOLIO_OVERVIEW", "VIEW_PAYMENTS", "APM_ADVISE_CONTRACTFILTER", "MANAGE_DOMESTIC_PAYMENTS", "MANAGE_INTERNATIONAL_PAYMENTS", "SIGN_DOMESTIC_PAYMENTS", "SIGN_INTERNATIONAL_PAYMENTS", "SIGN_STANDING_ORDER", "VIEW_PROFILE_FUND_SETTINGS", "VIEW_WEALTH_OVERVIEW"],
                        "productBuildingBlocks": [5, 8, 20, 25, 15],
                        "productGroups": ["PAYMENT_ACCOUNTS", "SAVINGS_ACCOUNTS", "INVESTMENTS", "FISCAL_CAPITAL_SOLUTIONS", "FISCAL_CAPITAL_SOLUTIONS_PRODUCTS", "MORTGAGE"],
                        "balanceTypes": ["IBMR", "ITBD"],
                        "excludeBlocked": false,
                        "contractIds": []
                    })
                });
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
                const result = await response.json();
                // console.log(`ABN AMRO Accounts List: ${JSON.stringify(result)}`);
                return {
                    content: [{ type: "text", text: JSON.stringify(result) }]
                };
            },
        );

        // ABN AMRO transactions tool
        server.registerTool(
            "abnamro-transactions",
            {
                description: `Fetches ABN AMRO transactions for a given account number. 
                Use 'lastMutationKey' from the result to fetch older transactions.`,
                inputSchema: {
                    accountNumber: z.string().describe("IBAN account number"),
                    lastMutationKey: z.string().optional().describe("lastMutationKey, used for the next page of mutations")
                }
            },
            async ({ accountNumber, lastMutationKey }) => {
                let url = `https://www-et1.abnamro.nl/mutations/${accountNumber}?accountNumber=${accountNumber}&includeActions=EXTENDED`;
                url += lastMutationKey ? `&lastMutationKey=${lastMutationKey}` : ''
                console.log(`Request URL: ${url}`);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: staticHeaders
                });
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }]
                };
            }
        );

        // ABN AMRO tasks tool
        server.registerTool(
            "abnamro-get-pending-transfers",
            {
                description: "Fetches ABN AMRO pending trasfer payment requests for the user.",
                inputSchema: {}
            },
            async () => {
                const url = "https://www-et1.abnamro.nl/my-abnamro/apis/bapi/tasks/v2/";
                const response = await fetch(url, {
                    method: 'GET',
                    headers: OAMSpecificHeaders
                });
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }]
                };
            }
        );

        // ABN AMRO message cards tool
        server.registerTool(
            "abnamro-message-cards",
            {
                description: "Fetches ABN AMRO message cards for the user.",
                inputSchema: {}
            },
            async () => {
                const url = "https://www-et1.abnamro.nl/my-abnamro/api/message-card/v1/message-cards";
                const response = await fetch(url, {
                    method: 'GET',
                    headers: staticHeaders
                });
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }]
                };
            }
        );

        // ABN AMRO Appointments tool
        server.registerTool(
            "abnamro-appointments",
            {
                description: "Fetches ABN AMRO appointments for the user.",
                inputSchema: {}
            },
            async () => {
                const url = "https://www-et1.abnamro.nl/my-abnamro/apis/party-online-appointment-request/v1/appointments";
                const response = await fetch(url, {
                    method: 'GET',
                    headers: OAMSpecificHeaders
                });
                console.log(`OAM API request : ${response.status} ${response.statusText}`);
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }]
                };
            }
        );

        // ABN AMRO Delete Payment Requests tool
        server.tool(
            "abnamro-delete-payment-request",
            "Deletes a transfer payment request for ABN AMRO",
            {
                taskIds: z.array(z.string()).describe("Array of transfer payment request IDs to delete")
            },
            async ({ taskIds }) => {
                console.log(`Deleting payment requests: ${taskIds}`);
                const url = "https://www-et1.abnamro.nl/my-abnamro/apis/bapi/tasks/v2/delete?sourceId=TPS&sourceSystem=DIGI_SIGN";
                const response = await fetch(url, {
                    method: 'POST',
                    headers: OAMSpecificHeaders,
                    body: JSON.stringify({ taskIds })
                });
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                return {
                    content: [{ type: "text", text: JSON.stringify(data) }]
                };
            }
        );

        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        res.on('close', () => {
            transport.close();
            server.close();
        });
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error',
                },
                id: null,
            });
        }
    }
});

app.get('/mcp', async (req: Request, res: Response) => {
    console.log('Received GET MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }));
});

app.delete('/mcp', async (req: Request, res: Response) => {
    console.log('Received DELETE MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }));
});

// Start the server
const PORT = 7000;
app.listen(PORT, () => {
    console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});