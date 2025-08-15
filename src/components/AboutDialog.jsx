import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/Dialog';
import { Button } from './ui/Button';
import { Info } from 'lucide-react';

const AboutDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Info className="mr-2 h-4 w-4" /> About
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About PM Accelerator</DialogTitle>
          <DialogDescription className="text-left pt-4">
            PM Accelerator is the #1 community for aspiring and established Product Managers to
            break into product and build their careers. We provide hands-on experience, mentorship from
            industry experts, and a network of peers to help you succeed in the competitive
            world of product management.
            <br /><br />
            Visit our <a href="https://www.linkedin.com/company/pm-accelerator/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn page</a> to learn more.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AboutDialog;