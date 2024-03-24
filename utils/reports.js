import puppeteer from 'puppeteer';
import { receiptPDFContent } from '../templates/receipt.js';
import { toBeIssuedCOA } from '../templates/toBeIssuedCOA.js';
import { paintingsAvailable } from '../templates/paintingsAvailable.js';
import { transactionMade } from '../templates/transactionMade.js';

export const generatePDFReceipt = async (user) => {
    try {
        const browser = await puppeteer.launch();

        // Create a new page
        const page = await browser.newPage();

        await page.setContent(receiptPDFContent(user));

        // Generate PDF from the HTML content
        const pdf = await page.pdf({ path: 'custom_report.pdf', format: 'A4', printBackground: true });

        // Close the browser
        await browser.close();

        return pdf
    } catch (error) {
        console.log(error.message)
    }
}

export const generatePDFToBeIssued = async (orders) => {
    try {
        const browser = await puppeteer.launch();

        // Create a new page
        const page = await browser.newPage();

        await page.setContent(toBeIssuedCOA(orders));

        // Generate PDF from the HTML content
        const pdf = await page.pdf({ format: 'A4', printBackground: true });

        // Close the browser
        await browser.close();

        return pdf
    } catch (error) {
        console.log(error.message)
    }
}

export const generatePDFPaintingsAvailable = async (paintings) => {
    try {
        const browser = await puppeteer.launch();

        // Create a new page
        const page = await browser.newPage();

        await page.setContent(paintingsAvailable(paintings));

        // Generate PDF from the HTML content
        const pdf = await page.pdf({ format: 'A4', printBackground: true });

        // Close the browser
        await browser.close();

        return pdf
    } catch (error) {
        console.log(error.message)
    }
}

export const generatePDFTransactionMade = async (orders) => {
    try {
        const browser = await puppeteer.launch();

        // Create a new page
        const page = await browser.newPage();

        await page.setContent(transactionMade(orders));

        // Generate PDF from the HTML content
        const pdf = await page.pdf({ format: 'A4', printBackground: true });

        // Close the browser
        await browser.close();

        return pdf
    } catch (error) {
        console.log(error.message)
    }
}




