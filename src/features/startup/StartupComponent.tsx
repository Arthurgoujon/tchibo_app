import React, {useEffect, useState} from 'react';
import {useKadoAuth} from '../user/auth/kadoAuth';
import RNBootSplash from 'react-native-bootsplash';

export const StartupComponent: React.FC<{}> = (props) => {
  const kadoAuth = useKadoAuth();
  const [isLoading, setIsLoading] = useState(true);
  const setupAppRequirements = async () => {
    await Promise.all([kadoAuth.loadAuthInfo()]);

    setIsLoading(false);
    const splashVisible = await RNBootSplash.getVisibilityStatus();
    if (splashVisible === 'visible') {
      await RNBootSplash.hide();
    }
  };

  useEffect(() => {
    setupAppRequirements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return null;
  }

  return <>{props.children}</>;
};
