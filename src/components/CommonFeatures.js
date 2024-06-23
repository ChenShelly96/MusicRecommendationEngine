import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import '../styles/commFeatures.css';
import { fetchCommonFeatureList, sendFeaturesToServer } from '../utils/functions';
const CommonFeatures = () => {
  const [commonFeatures, setCommonFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
const history = useHistory();
  useEffect(() => {
    const fetchCommonFeatures = async () => {
      try {
        const response = await fetchCommonFeatureList();
        setCommonFeatures(response);
        console.log(response);
      } catch (error) {
        console.error('Error fetching common features:', error);
      }
    };

    fetchCommonFeatures();
  }, []);

  const handleFeatureClick = (feature) => {
    setSelectedFeatures((prevFeatures) => [...prevFeatures, feature]);
  };

  const handleSave = async () => {
    try {
      const response = await sendFeaturesToServer(selectedFeatures);
      console.log('Features saved successfully:', response);
      alert('Features saved successfully!');
    } catch (error) {
      console.error('Error saving features:', error);
      alert('Error saving features.');
    }
  };


  const handleNext = () => {
   
    
    history.push('/spotify-player');
    
  };
  
  return (
    <Container>
      <h1>Common Features</h1>
      {commonFeatures.map((feature, index) => (
        <div key={index} className="feature-item">
          <Button className="feature-btn" onClick={() => handleFeatureClick(feature)}>
            {renderValue(feature)}
          </Button>
        </div>
      ))}

      <Button variant="primary" className="next-selected-btn" onClick={handleNext}>
                            Next
                        </Button>
      <Button variant="primary" className="save-selected-btn" onClick={handleSave}>
        Save Selected Features
      </Button>
    </Container>
  );
};

const renderValue = (feature) => {
  switch (feature.rule) {
    case 'all_same_rule':
      return `All values of ${feature.field} are ${feature.value}`;
    case 'dominant_value_rule':
      return `${feature.field} dominant values are: ${feature.value.join(',')} `;
    case 'multiple_threshold_rule':
      return `${feature.field} values are between ${feature.value.min}-${feature.value.max}`;
    case 'percentage_rule':
      return `Percentage of ${feature.field} is ${feature.value.join(', ')}`;
    case 'within_threshold_rule':
      return `${feature.field} values are between ${feature.value.min}-${feature.value.max}`;
    default:
      return null;
  }
};

export default CommonFeatures;
