import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';

GlobalWorkerOptions.workerSrc = workerSrc;

export async function parseDocumentFile(file) {
  const fileName = file.name || '';
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';

  if (extension === 'txt') {
    return file.text();
  }

  if (extension === 'pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      let text = '';

      for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
        const page = await pdf.getPage(pageIndex);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(' ');
        text += `${pageText}\n\n`;
      }

      return text.trim();
    } catch (parseError) {
      throw new Error('Unable to extract text from this PDF. Please try a different PDF file or paste the text manually.');
    }
  }

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value.trim();
  }

  if (extension === 'doc') {
    throw new Error('DOC files are not supported in-browser. Please use DOCX or PDF instead.');
  }

  throw new Error('Unsupported file type. Please upload TXT, PDF, or DOCX.');
}
