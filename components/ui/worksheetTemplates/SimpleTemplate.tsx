import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

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

const SimpleTemplate = ({ jsonData, includeAnswers }) => (
  <Document>
    <Page style={stylesSimple.page}>
      <Text style={stylesSimple.title}>{jsonData.title || 'Guided Notes'}</Text>
      {jsonData.sections?.map((section, sectionIndex) => (
        <View key={sectionIndex} style={stylesSimple.section}>
          <Text style={stylesSimple.subtitle}>{section.title}</Text>
          {section.content?.map((line, contentIndex) => (
            <Text key={contentIndex} style={stylesSimple.content}>
              {includeAnswers
                ? line.replace(/<mark>(.*?)<\/mark>/g, (match, p1) => p1)
                : line.replace(/<mark>(.*?)<\/mark>/g, (match, p1) => '_'.repeat(p1.length))}
            </Text>
          ))}
          {section.lists?.map((list, listIndex) => (
            <View key={listIndex}>
              <Text style={stylesSimple.listTitle}>{list.list_title}</Text>
              {list.items?.map((item, itemIndex) => (
                <Text key={itemIndex} style={stylesSimple.listItem}>
                  {includeAnswers
                    ? item.replace(/<mark>(.*?)<\/mark>/g, (match, p1) => p1)
                    : item.replace(/<mark>(.*?)<\/mark>/g, (match, p1) => '_'.repeat(p1.length))}
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
  </Document>
);

export default SimpleTemplate;
