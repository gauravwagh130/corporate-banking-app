pipeline {
  agent any

  environment {
    AWS_REGION = "ap-south-1"
    AWS_ACCOUNT_ID = "376129878137"
    ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    BACKEND_IMAGE = "corporate-backend"
    FRONTEND_IMAGE = "corporate-frontend"
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/gauravwagh130/corporate-banking-app.git'
      }
    }

    stage('Build Backend Image') {
      steps {
        dir('backend') {
          sh 'docker build -t $ECR_REGISTRY/$BACKEND_IMAGE:latest .'
        }
      }
    }

    stage('Build Frontend Image') {
      steps {
        dir('frontend') {
          sh 'docker build -t $ECR_REGISTRY/$FRONTEND_IMAGE:latest .'
        }
      }
    }

    stage('Login to ECR') {
      steps {
        sh '''
          aws ecr get-login-password --region $AWS_REGION \
          | docker login --username AWS --password-stdin $ECR_REGISTRY
        '''
      }
    }

    stage('Push Images to ECR') {
      steps {
        sh '''
          docker push $ECR_REGISTRY/$BACKEND_IMAGE:latest
          docker push $ECR_REGISTRY/$FRONTEND_IMAGE:latest
        '''
      }
    }

    stage('Deploy on EC2') {
      steps {
        sshagent(['ec2-ssh-key']) {
          sh '''
            ssh ubuntu@<EC2_PUBLIC_IP> "
              cd ~/ &&
              docker-compose pull &&
              docker-compose up -d
            "
          '''
        }
      }
    }
  }
}
