import React from 'react';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { JsonData } from './types';

const stylesSimple = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10
  },
  content: {
    fontSize: 14,
    marginBottom: 10
  },
  listTitle: {
    fontSize: 16,
    marginBottom: 5,
    color: '#00008B'
  },
  listItem: {
    fontSize: 14,
    marginLeft: 20,
    marginBottom: 5
  }
});

interface SimpleTemplateProps {
  jsonData: JsonData;
  includeAnswers: boolean;
}

const preprocessText = (text: string, includeAnswers: boolean) => {
  return includeAnswers
    ? text.replace(/<mark>(.*?)<\/mark>/g, (_, p1) => p1)
    : text.replace(/<mark>(.*?)<\/mark>/g, (_, p1) => '_'.repeat(p1.length));
};

const SimpleTemplate: React.FC<SimpleTemplateProps> = ({ jsonData, includeAnswers }) => (
  <Page style={stylesSimple.page}>
    <Text style={stylesSimple.title}>{jsonData.title || 'Guided Notes'}</Text>
    {jsonData.sections?.map((section, sectionIndex) => (
      <View key={sectionIndex} style={stylesSimple.section}>
        <Text style={stylesSimple.subtitle}>{section.title}</Text>
        {section.content?.map((line, contentIndex) => (
          <Text key={contentIndex} style={stylesSimple.content}>
            {preprocessText(line, includeAnswers)}
          </Text>
        ))}
        {section.lists?.map((list, listIndex) => (
          <View key={listIndex}>
            <Text style={stylesSimple.listTitle}>{list.list_title}</Text>
            {list.items?.map((item, itemIndex) => (
              <Text key={itemIndex} style={stylesSimple.listItem}>
                {preprocessText(item, includeAnswers)}
              </Text>
            ))}
          </View>
        ))}
      </View>
    ))}
    {jsonData.questions && (
      <View style={stylesSimple.section}>
        <Text style={stylesSimple.subtitle}>Questions</Text>
        {jsonData.questions.map((q, index) => (
          <View key={index}>
            <Text style={stylesSimple.content}>{q.question}</Text>
            {includeAnswers && <Text style={stylesSimple.content} color="red">{q.answer}</Text>}
          </View>
        ))}
      </View>
    )}
  </Page>
);

export const generatePDF = async (jsonData: JsonData, level: string, includeAnswers = false): Promise<Blob> => {
  const element = (
    <Document>
      <SimpleTemplate jsonData={jsonData} includeAnswers={includeAnswers} />
    </Document>
  );
  const pdfDoc = pdf();
  pdfDoc.updateContainer(element);
  const blob = await pdfDoc.toBlob();
  return blob;
};
