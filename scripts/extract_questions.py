import zipfile
import xml.etree.ElementTree as ET
import re
import json
import os

NAMESPACES = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

def extract_paragraphs(docx_path):
    with zipfile.ZipFile(docx_path) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        paras = []
        for p in tree.findall('.//w:p', NAMESPACES):
            text = ''.join(p.itertext()).strip()
            if text:
                paras.append(text)
        return paras

def parse_500_bank(docx_path):
    paras = extract_paragraphs(docx_path)
    
    sections = [
        ('data_assistant', 'Integrated Data Assistant', 12, 515, 515, 618),
        ('lab_optimizer', 'Integrated Laboratory Service Optimizer', 618, 1121, 1121, 1224),
        ('testing_assistant', 'Integrated Testing Assistant', 1224, 1727, 1727, 1830),
        ('health_qi_optimizer', 'Integrated Health / Quality Improvement Service Optimizer', 1830, 2333, 2333, 2436),
        ('client_navigator', 'Client Navigator', 2436, 2939, 2939, len(paras))
    ]
    
    roles_data = {}
    
    for role_id, role_title, q_start, q_end, ak_start, ak_end in sections:
        q_slice = paras[q_start:q_end]
        ak_slice = paras[ak_start:ak_end]
        
        # Parse answer key
        ak_map = {}
        for p in ak_slice:
            matches = re.findall(r'(\d+)\.\s*([A-D])', p)
            for num_str, ans in matches:
                ak_map[int(num_str)] = ans
        
        questions = []
        curr_q = None
        curr_topic = 'General'
        
        for p in q_slice[2:]: # skip role title and instructions
            m_q = re.match(r'^(\d+)\.\s+(.*)', p)
            m_opt = re.match(r'^([A-D])\.\s+(.*)', p)
            
            if m_q:
                q_num = int(m_q.group(1))
                q_text = m_q.group(2).strip()
                
                # Check if this question defines a new topic (Pattern: "What best describes [topic]?")
                m_topic = re.search(r'What best describes (.*?)\?', q_text, re.IGNORECASE)
                if m_topic:
                    curr_topic = m_topic.group(1).strip()
                elif 'topic' in curr_topic:
                    pass
                
                curr_q = {
                    'id': f'{role_id}_q{q_num}',
                    'roleId': role_id,
                    'questionNumber': q_num,
                    'questionText': q_text,
                    'options': {},
                    'correctAnswer': ak_map.get(q_num, ''),
                    'topic': curr_topic.title(),
                    'source': '500_bank'
                }
                questions.append(curr_q)
            elif m_opt and curr_q:
                curr_q['options'][m_opt.group(1)] = m_opt.group(2).strip()
        
        roles_data[role_id] = {
            'roleId': role_id,
            'roleTitle': role_title,
            'questions': questions
        }
        
    return roles_data

def parse_bridge_supplementary(docx_path):
    paras = extract_paragraphs(docx_path)
    
    # Section mappings for topics in bridge doc
    topic_headers = [
        (21, 'CCCRN and BRIDGE-N'),
        (66, 'Client Navigation & Linkage'),
        (127, 'Referral Systems & Closed-Loop Referrals'),
        (166, 'HIV-Related Services & ART'),
        (211, 'Tuberculosis (TB) Services'),
        (244, 'Malaria & MNCH Services'),
        (289, 'Confidentiality, Ethics & Safeguarding'),
        (340, 'Client Navigator Role Distinction'),
        (368, 'Practical Workplace Scenarios')
    ]
    
    questions = []
    curr_q = None
    curr_topic = 'CCCRN and BRIDGE-N'
    
    for idx, p in enumerate(paras):
        for line_idx, top in topic_headers:
            if idx == line_idx or p.startswith(top):
                curr_topic = top
                
        m_q = re.match(r'^(\d+)\.\s+(.*\?)', p)
        m_opt = re.match(r'^([A-D])\.\s+(.*)', p)
        m_ans = re.match(r'^Answer:\s*([A-D])', p)
        
        if m_q and '?' in p:
            q_num = int(m_q.group(1))
            q_text = m_q.group(2).strip()
            curr_q = {
                'id': f'cn_supp_q{q_num}',
                'roleId': 'client_navigator',
                'questionNumber': q_num,
                'questionText': q_text,
                'options': {},
                'correctAnswer': '',
                'topic': curr_topic,
                'source': 'bridge_supplementary'
            }
            questions.append(curr_q)
        elif m_opt and curr_q:
            curr_q['options'][m_opt.group(1)] = m_opt.group(2).strip()
        elif m_ans and curr_q:
            curr_q['correctAnswer'] = m_ans.group(1)
            
    return questions

def main():
    doc_500_path = r'c:\Users\user\Downloads\CCCRN_BRIDGE_N_500_Practice_Questions.docx'
    doc_bridge_path = r'c:\Users\user\Downloads\CCCRN BRIDGE.docx'
    
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
    os.makedirs(output_dir, exist_ok=True)
    
    print('Extracting 500 practice questions...')
    roles_500 = parse_500_bank(doc_500_path)
    
    # Save individual role question files
    for role_id, data in roles_500.items():
        filename = f'questions_{role_id}.json'
        file_path = os.path.join(output_dir, filename)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data['questions'], f, indent=2, ensure_ascii=False)
        print(f'Wrote {len(data["questions"])} questions to {filename}')
        
    print('Extracting supplementary Client Navigator questions...')
    bridge_questions = parse_bridge_supplementary(doc_bridge_path)
    supp_path = os.path.join(output_dir, 'questions_bridge_supplementary.json')
    with open(supp_path, 'w', encoding='utf-8') as f:
        json.dump(bridge_questions, f, indent=2, ensure_ascii=False)
    print(f'Wrote {len(bridge_questions)} questions to questions_bridge_supplementary.json')
    
    # Roles definition file
    roles_meta = [
        {
            "id": "data_assistant",
            "title": "Integrated Data Assistant",
            "focus": "Data entry, E-Deck support, record reconciliation, data completeness and quality assurance.",
            "iconName": "Database",
            "questionCount": 100,
            "topicsCount": 20
        },
        {
            "id": "lab_optimizer",
            "title": "Integrated Laboratory Service Optimizer",
            "focus": "Laboratory QA, specimen handling, biosafety, turnaround time, equipment maintenance and result management.",
            "iconName": "FlaskConical",
            "questionCount": 100,
            "topicsCount": 20
        },
        {
            "id": "testing_assistant",
            "title": "Integrated Testing Assistant",
            "focus": "Rapid diagnostic testing, specimen integrity, infection prevention, QC and reactive result linkage.",
            "iconName": "Activity",
            "questionCount": 100,
            "topicsCount": 20
        },
        {
            "id": "health_qi_optimizer",
            "title": "Integrated Health / Quality Improvement Service Optimizer",
            "focus": "Continuous quality improvement (CQI), PDSA cycles, indicator tracking, workflow optimization and mentorship.",
            "iconName": "TrendingUp",
            "questionCount": 100,
            "topicsCount": 20
        },
        {
            "id": "client_navigator",
            "title": "Client Navigator",
            "focus": "Client navigation, linkage to care, appointment tracking, retention, closed-loop referrals and adherence support.",
            "iconName": "HeartHandshake",
            "questionCount": 100,
            "supplementaryCount": 62,
            "topicsCount": 20
        }
    ]
    roles_path = os.path.join(output_dir, 'roles.json')
    with open(roles_path, 'w', encoding='utf-8') as f:
        json.dump(roles_meta, f, indent=2, ensure_ascii=False)
    print('Wrote roles.json')

if __name__ == '__main__':
    main()
