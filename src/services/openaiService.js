import OpenAI from 'openai';

/**
 * OpenAI service for MedTech AI Scribe functionality
 */
class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  /**
   * Generate clinical note from consultation transcript
   */
  async generateClinicalNote(transcriptData, template = 'general', patientContext = {}) {
    try {
      const systemPrompt = this.getSystemPrompt(template);
      const userMessage = this.formatTranscriptForProcessing(transcriptData, patientContext);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'clinical_note_response',
            schema: {
              type: 'object',
              properties: {
                note: { type: 'string' },
                extractedData: {
                  type: 'object',
                  properties: {
                    symptoms: {
                      type: 'object',
                      properties: {
                        chief_complaint: { type: 'string' },
                        history: { type: 'string' },
                        duration: { type: 'string' },
                        severity: { type: 'string' },
                        associated: { type: 'array', items: { type: 'string' } }
                      }
                    },
                    examination: {
                      type: 'object',
                      properties: {
                        vitals: {
                          type: 'object',
                          properties: {
                            bp: { type: 'string' },
                            hr: { type: 'string' },
                            temp: { type: 'string' },
                            rr: { type: 'string' }
                          }
                        },
                        physical: { type: 'string' },
                        findings: { type: 'array', items: { type: 'string' } }
                      }
                    },
                    diagnosis: {
                      type: 'object',
                      properties: {
                        primary: { type: 'string' },
                        differential: { type: 'array', items: { type: 'string' } },
                        reasoning: { type: 'string' }
                      }
                    },
                    treatment: {
                      type: 'object',
                      properties: {
                        medications: { type: 'array', items: { type: 'string' } },
                        interventions: { type: 'array', items: { type: 'string' } },
                        education: { type: 'string' }
                      }
                    }
                  }
                },
                confidence: { type: 'number' },
                processingTime: { type: 'number' }
              },
              required: ['note', 'extractedData', 'confidence', 'processingTime'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.3,
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content);
      return {
        ...result,
        usage: response.usage
      };
    } catch (error) {
      console.error('Error generating clinical note:', error);
      throw new Error(`Clinical note generation failed: ${error.message}`);
    }
  }

  /**
   * Extract structured clinical data from transcript
   */
  async extractClinicalData(transcriptData) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a medical AI assistant that extracts structured clinical data from consultation transcripts. Focus on symptoms, examination findings, diagnoses, and treatment plans.'
          },
          {
            role: 'user',
            content: `Extract clinical data from this consultation transcript:\n\n${this.formatTranscriptForProcessing(transcriptData)}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'clinical_data_extraction',
            schema: {
              type: 'object',
              properties: {
                symptoms: {
                  type: 'object',
                  properties: {
                    chief_complaint: { type: 'string' },
                    history: { type: 'string' },
                    duration: { type: 'string' },
                    severity: { type: 'string' },
                    associated: { type: 'array', items: { type: 'string' } }
                  }
                },
                examination: {
                  type: 'object',
                  properties: {
                    vitals: {
                      type: 'object',
                      properties: {
                        bp: { type: 'string' },
                        hr: { type: 'string' },
                        temp: { type: 'string' },
                        rr: { type: 'string' }
                      }
                    },
                    physical: { type: 'string' },
                    findings: { type: 'array', items: { type: 'string' } }
                  }
                },
                diagnosis: {
                  type: 'object',
                  properties: {
                    primary: { type: 'string' },
                    differential: { type: 'array', items: { type: 'string' } },
                    reasoning: { type: 'string' }
                  }
                },
                treatment: {
                  type: 'object',
                  properties: {
                    medications: { type: 'array', items: { type: 'string' } },
                    interventions: { type: 'array', items: { type: 'string' } },
                    education: { type: 'string' }
                  }
                }
              },
              required: ['symptoms', 'examination', 'diagnosis', 'treatment'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.2
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error extracting clinical data:', error);
      throw error;
    }
  }

  /**
   * Analyze clinical image with context
   */
  async analyzeClinicalImage(imageBase64, patientContext = {}, description = '') {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a medical AI assistant specialized in clinical image analysis. Provide detailed, professional analysis of medical images while considering patient context.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this clinical image. Patient context: ${JSON.stringify(patientContext)}. Additional description: ${description}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'clinical_image_analysis',
            schema: {
              type: 'object',
              properties: {
                findings: { type: 'array', items: { type: 'string' } },
                interpretation: { type: 'string' },
                recommendations: { type: 'array', items: { type: 'string' } },
                confidence: { type: 'number' },
                requiresSpecialistReview: { type: 'boolean' }
              },
              required: ['findings', 'interpretation', 'recommendations', 'confidence'],
              additionalProperties: false
            }
          }
        },
        max_tokens: 1000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing clinical image:', error);
      throw error;
    }
  }

  getSystemPrompt(template) {
    const basePrompt = 'You are an expert medical AI assistant specializing in clinical documentation. Generate comprehensive, accurate clinical notes following medical standards.';
    
    const templatePrompts = {
      general: `${basePrompt} Focus on general consultation documentation with standard SOAP format.`,
      'follow-up': `${basePrompt} This is a follow-up visit. Focus on progress since last visit and treatment response.`,
      acute: `${basePrompt} This is an acute care consultation. Prioritize immediate assessment and urgent management.`,
      chronic: `${basePrompt} Focus on chronic disease management, medication adjustments, and long-term care planning.`,
      preventive: `${basePrompt} This is a preventive care visit. Focus on screening, risk assessment, and health promotion.`,
      'mental-health': `${basePrompt} Focus on mental health assessment, psychological symptoms, and treatment planning.`,
      pediatric: `${basePrompt} This is a pediatric consultation. Consider age-appropriate assessment and family involvement.`,
      geriatric: `${basePrompt} Focus on geriatric-specific concerns, functional assessment, and multi-morbidity management.`
    };

    return templatePrompts[template] || templatePrompts.general;
  }

  formatTranscriptForProcessing(transcriptData, patientContext = {}) {
    const transcript = transcriptData.map(item => 
      `[${item.timestamp}] ${item.speaker}: ${item.text} (Confidence: ${Math.round(item.confidence * 100)}%)`
    ).join('\n');

    const contextInfo = Object.keys(patientContext).length > 0 
      ? `\n\nPatient Context:\n${JSON.stringify(patientContext, null, 2)}`
      : '';

    return `Consultation Transcript:${contextInfo}\n\n${transcript}`;
  }
}

export default new OpenAIService();